'use client';
import { useEffect, useState, useRef } from 'react';
import { getPendingUploads, removePendingUpload, updateUploadStatus } from '../lib/offline-queue';

export function UploadQueueSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const isSyncing = useRef(false);

  const processQueue = async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    if (isSyncing.current) return;
    
    isSyncing.current = true;
    try {
      const pending = await getPendingUploads();
      
      if (pending.length === 0) {
        setPendingCount(0);
        return;
      }

      setPendingCount(pending.length);

      for (const item of pending) {
        if (item.status === 'uploading') continue; // Skip if already trying

        const now = Date.now();
        const backoffSeconds = getBackoffSeconds(item.attempts);
        if (now - item.createdAt < backoffSeconds * 1000 && item.attempts > 0) {
          continue; // Wait for backoff
        }

        await updateUploadStatus(item.id, 'uploading', item.attempts + 1);
        
        try {
          const resp = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: item.dataUrl, uploadId: item.id }),
          });
          
          if (resp.ok) {
            const result = await resp.json();
            if (result.url) {
              await removePendingUpload(item.id);
            }
          } else {
            await updateUploadStatus(item.id, 'pending');
          }
        } catch (e) {
          // Network failure
          await updateUploadStatus(item.id, 'pending');
        }
      }
      
      const newPending = await getPendingUploads();
      setPendingCount(newPending.length);
      
    } catch (err) {
      console.error('Error processing upload queue', err);
    } finally {
      isSyncing.current = false;
    }
  };

  useEffect(() => {
    const handleOnline = () => processQueue();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        processQueue();
      }
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const interval = setInterval(processQueue, 10000); // Check every 10s

    processQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  if (pendingCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-bg-surface border border-brand-primary/20 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-[9999] text-sm text-text-main font-medium animate-in fade-in slide-in-from-bottom-4">
      <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
      {pendingCount === 1 ? '1 foto aguardando envio...' : `${pendingCount} fotos aguardando envio...`}
    </div>
  );
}

function getBackoffSeconds(attempts: number) {
  if (attempts <= 1) return 5;
  if (attempts === 2) return 15;
  if (attempts === 3) return 30;
  if (attempts === 4) return 60;
  return 300; // max 5 mins
}
