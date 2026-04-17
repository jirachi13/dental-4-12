import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Stethoscope } from 'lucide-react';
// Logo placeholder — replace with actual Barangay Tanyag logo file
const logoImage = null;

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  const quickLogins = [
    { email: 'dentist@floral.ph', role: 'Dentist' },
    { email: 'aide@floral.ph', role: 'Dental Aide' },
    { email: 'school@floral.ph', role: 'Clinic Staff' },
    { email: 'barangay@floral.ph', role: 'School Admin' },
    { email: 'admin@floral.ph', role: 'System Admin' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {logoImage ? (
              <img src={logoImage} alt="Barangay Tanyag" className="w-24 h-24 object-contain" />
            ) : (
              <div className="w-24 h-24 bg-[#E31E24] rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">BT</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-[#1E40AF] mb-2">Floral</h1>
          <p className="text-gray-600">School Dental Clinic Management System</p>
          <p className="text-sm text-gray-500 mt-1">Barangay Tanyag, Taguig City</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  placeholder="your.email@floral.ph"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">
                Role is auto-detected from account
              </div>
              <a href="#" className="text-[#1E40AF] hover:text-[#1E3A8A]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E31E24] hover:bg-[#c71a1f] text-white font-medium py-3 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Quick Login Demo Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Login:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickLogins.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('demo');
                  }}
                  className="text-xs px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#1E40AF] rounded border border-blue-200 transition-colors"
                >
                  {account.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2026 Barangay Tanyag Health Office. All rights reserved.
        </p>
      </div>
    </div>
  );
};
