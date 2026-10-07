import Image from "next/image";
export function Brand() {
  return (
    <div className="cms-brand">
      <Image src="/logo.png" width={32} height={32} alt="" />
      <span>
        AEGIS <b>AI</b>
        <small>Administration</small>
      </span>
    </div>
  );
}
export function Icon() {
  return <Image src="/logo.png" width={24} height={24} alt="Aegis AI" />;
}
export function LoginIntro() {
  return (
    <div className="cms-login">
      <h1>Connexion</h1>
      <p>Accédez à vos articles et à vos médias.</p>
    </div>
  );
}
