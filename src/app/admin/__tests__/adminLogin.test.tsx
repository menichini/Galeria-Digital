import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginPage from '@/app/admin/login/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: pushMock });

describe('AdminLoginPage', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    window.sessionStorage.clear();
    pushMock.mockReset();
  });

  it('deve autenticar com credenciais corretas e redirecionar', async () => {
    render(<AdminLoginPage />);

    const userInput = screen.getByPlaceholderText('Usuário');
    const passInput = screen.getByPlaceholderText('Senha');
    const submitBtn = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(userInput, { target: { value: 'admin' } });
    fireEvent.change(passInput, { target: { value: 'senha123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(window.sessionStorage.getItem('isAdmin')).toBe('true');
      expect(pushMock).toHaveBeenCalledWith('/admin');
    });
  });

  it('exibe erro com credenciais inválidas', async () => {
    render(<AdminLoginPage />);

    const userInput = screen.getByPlaceholderText('Usuário');
    const passInput = screen.getByPlaceholderText('Senha');
    const submitBtn = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(userInput, { target: { value: 'wrong' } });
    fireEvent.change(passInput, { target: { value: 'wrong' } });
    fireEvent.click(submitBtn);

    const errorMsg = await screen.findByText(/credenciais inválidas/i);
    expect(errorMsg).toBeInTheDocument();
    expect(window.sessionStorage.getItem('isAdmin')).toBeNull();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
