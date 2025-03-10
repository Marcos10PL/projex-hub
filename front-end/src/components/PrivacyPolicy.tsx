import privacyPolicy from "../lib/privacyPolicy";
import Logo from "./Logo";

export default function PrivacyPolicy() {
  return (
    <>
      <header className="text-center my-8 text-4xl">
        <Logo />
      </header>
      <main className="md:w-2/3 mx-auto px-5 text-lg">
        <header className="mb-3">
          <h1 className="font-bold text-2xl">Privacy Policy</h1>
        </header>
        <article>
          {privacyPolicy.map((section, index) => (
            <section key={index} className="py-3">
              <h2 className="font-bold">{`${index + 1}. ${section.header}`}</h2>
              <p className="py-3">{section.body}</p>
              {section.list && (
                <ul className="list-disc mx-5">
                  {section.list.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
    </>
  );
}
