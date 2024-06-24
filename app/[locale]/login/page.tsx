'use client';

import {useRouter} from 'next/navigation';
import {signIn} from 'next-auth/react';
import {useLocale, useTranslations} from 'next-intl';
import {FormEvent, useState} from 'react';
//import PageLayout from '../../../components/PageLayout';

export default function Login() {
  const locale = useLocale();
  const t = useTranslations('Login');
  const [error, setError] = useState<string>();
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (error) setError(undefined);

    const formData = new FormData(event.currentTarget);
    signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false
    }).then((result) => {
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/' + locale);
      }
    });
  }

  return (
    <div title={t('title')}>
      <form
        action="/api/auth/callback/credentials"
        method="post"
        onSubmit={onSubmit}
        style={{display: 'flex', flexDirection: 'column', gap: 10, width: 300}}
      >
        <label style={{display: 'flex'}}>
          <span style={{display: 'inline-block', flexGrow: 1, minWidth: 100}}>
            {t('username')}
          </span>
          <input name="username" type="text" />
        </label>
        <label style={{display: 'flex'}}>
          <span style={{display: 'inline-block', flexGrow: 1, minWidth: 100}}>
            {t('password')}
          </span>
          <input name="password" type="password" />
        </label>
        {error && <p>{t('error', {error})}</p>}
        <button type="submit">{t('submit')}</button>
      </form>
    </div>
  );
}

// import { useTranslations } from "next-intl";

// export default function Home() {
//   const t = useTranslations("MapTotal");

//   // Extract the navigation object keys from the translations
//   //const navigationKeys = Object.keys(t.raw("navigation"));
//   return (
//     <div >
//       <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-5">
//           {/* <p>{t(`title`)}</p> */}
//           <p>Home</p>
//       </div>
//     </div>
//   );
// }
