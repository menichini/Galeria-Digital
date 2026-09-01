import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminPage from '@/app/admin/page';
// import '@testing-library/jest-dom/extend-expect';

// Mock fetch for list and delete
const mockFiles = [
  { name: 'photo1.jpg', url: 'https://example.com/photo1.jpg' },
  { name: 'photo2.jpg', url: 'https://example.com/photo2.jpg' },
];

beforeEach(() => {
  // Set a fake admin token
  window.sessionStorage.setItem('adminToken', 'test-token');
  // Mock fetch implementation
  global.fetch = jest.fn().mockImplementation((url, options) => {
    if (url.includes('/api/admin/list')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ files: mockFiles }),
      } as any);
    }
    if (url.includes('/api/admin/delete')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) } as any);
    }
    return Promise.reject(new Error('Unexpected fetch call'));
  });
});

afterEach(() => {
  jest.resetAllMocks();
  window.sessionStorage.clear();
});

test('renders admin page with list of photos', async () => {
  render(<AdminPage />);
  // Wait for fetch to complete and cards to appear
  await waitFor(() => {
    expect(screen.getByText('photo1.jpg')).toBeInTheDocument();
    expect(screen.getByText('photo2.jpg')).toBeInTheDocument();
  });
});

test('deletes a photo when trash button is clicked', async () => {
  render(<AdminPage />);
  await waitFor(() => screen.getByText('photo1.jpg'));
  const deleteButtons = screen.getAllByText('🗑️ Excluir');
  // Mock confirm to always true
  const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  fireEvent.click(deleteButtons[0]);
  await waitFor(() => {
    // After deletion, fetchFiles is called again – the mock returns same list, but we can assert fetch called twice
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
  confirmSpy.mockRestore();
});
