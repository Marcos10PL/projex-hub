import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import privacyPolicy from "../../lib/privacyPolicy";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate(-1)} className="link cursor-pointer py-3">
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
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
    </>
  );
}
