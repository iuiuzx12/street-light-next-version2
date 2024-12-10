'use client';

import {useRouter} from 'next/navigation';
//import {useLocale, useTranslations} from 'next-intl';

export default function notAuth() {
  //const locale = useLocale();
  //const t = useTranslations('Login');
  const router = useRouter()
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-4">You do not have permission to access this page. Please contact the administrator if you believe this is an error.</p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => router.back()}
        >
          Close
        </button>
      </div>
    </div>
  );
}