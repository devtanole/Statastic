import { RegistrationForm } from '../components/forms/Registration';
import { SignIn } from '../components/forms/SignIn';

type Props = {
  mode: 'sign-up' | 'sign-in';
};
export function AuthPage({ mode }: Props) {
  return (
    <div className="sign container m-4">
      {mode === 'sign-up' && <RegistrationForm />}
      {mode === 'sign-in' && <SignIn />}
    </div>
  );
}
