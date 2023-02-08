import { useState, useReducer } from "react"
import { FcGoogle } from "react-icons/fc"
import { authorize, signUpWithEmail } from "../firebase/auth"

const listStyle =
  "flex gap-5 before:inline-grid before:min-h-[40px] before:min-w-[40px] before:max-h-[40px] before:max-w-[40px] before:place-items-center before:rounded-full before:bg-emerald-400 before:text-sm before:font-bold before:text-primary-neutral before:shadow-md before:shadow-black/20 before:content-[counter(howToBuy)] before:[counter-increment:howToBuy]"

type AuthData = {
  email: string
  password: string
}

const Auth = () => {
  const [isGoogleAuth, setIsGoogleAuth] = useState(true)

  const [{ email, password }, updateEvent] = useReducer(
    (prev: AuthData, next: Partial<AuthData>) => {
      return { ...prev, ...next }
    },
    { email: "", password: "" } as AuthData
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signUpWithEmail(email, password)
  }

  return (
    <section>
      {/* background */}
      <div className="fixed inset-0 -z-10">
        <div className="h-[clamp(300px,40vw,40vh)] bg-emerald-600"></div>
        <div className="h-screen bg-teal-900"></div>
      </div>
      <div className="mx-auto max-w-4xl px-5">
        {/* logo */}
        <div className="my-6 flex items-center gap-3 text-white">
          <img src="/logo.svg" alt="logo" className="w-10" />
          <span className="font-sans text-xl font-bold">Chat-App</span>
        </div>
        {/* dialog */}
        <div className="w-full rounded-md bg-white px-12 py-8 text-slate-800">
          <h2 className="text-xl font-medium ">Use Chat-App On Any Device</h2>
          <div className="flex flex-wrap gap-8">
            <ol className="mt-12 space-y-8 text-lg [counter-reset:howToBuy]">
              <li className={` ${listStyle}`}>
                Chat With Friends From Any where
              </li>
              <li className={` ${listStyle}`}>
                All You Need Is Just A Browser
              </li>
              <li className={` ${listStyle}`}>Share Any Document upto 20 MB</li>
              <li className={` ${listStyle}`}>
                Easy To Use Just Sign In With Google
              </li>
            </ol>
            {isGoogleAuth ? (
              <button
                type="button"
                onClick={authorize}
                className="flex flex-grow flex-col items-center justify-center"
              >
                <FcGoogle size={"15rem"} />
                <span className="text-lg font-medium">Sign Up With Google</span>
              </button>
            ) : (
              <form
                className="flex flex-grow flex-col items-center justify-center gap-3 p-3"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  className="input-ghost input w-full text-black focus-within:text-white"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => updateEvent({ email: e.target.value })}
                />
                <input
                  type="password"
                  className="input-ghost input w-full text-black focus-within:text-white"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => updateEvent({ password: e.target.value })}
                />
                <button className="btn-ghost btn" type="submit">
                  Submit
                </button>
              </form>
            )}
          </div>
          {/* authentication with */}
          <div className="mt-3 flex items-center justify-center gap-1 pt-4 font-medium">
            <label htmlFor="authProvider">
              To Continue With Email & Password Check This Box
            </label>
            <input
              id="authProvider"
              type="checkbox"
              className="checkbox-primary checkbox"
              onChange={(e) => setIsGoogleAuth(!e.target.checked)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Auth
