import { useState, useReducer } from "react"
import { toast } from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { authorize, signInWithEmail, signUpWithEmail } from "../firebase/auth"

const listStyle =
  "flex gap-5 before:inline-grid before:min-h-[40px] before:min-w-[40px] before:max-h-[40px] before:max-w-[40px] before:place-items-center before:rounded-full before:bg-emerald-400 before:text-sm before:font-bold before:text-primary-neutral before:shadow-md before:shadow-black/20 before:content-[counter(howToBuy)] before:[counter-increment:howToBuy]"

type AuthData = {
  email: string
  password: string
}

const Auth = () => {
  const [isGoogleAuth, setIsGoogleAuth] = useState(true)
  const [HaveAccount, setHaveAccount] = useState(true)
  const [image, setImage] = useState<string>("")

  const isSelectImage = image.length > 0

  const [{ email, password }, updateEvent] = useReducer(
    (prev: AuthData, next: Partial<AuthData>) => {
      return { ...prev, ...next }
    },
    { email: "", password: "" } as AuthData
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!HaveAccount) {
      if (!isSelectImage) return toast.error("please provide image")
      signUpWithEmail(email, password)
    } else signInWithEmail(email, password)
  }

  const ImageChangeHandler = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.result) {
        const extension = (reader.result as string).split(";")[0]?.split("/")[1]
        if (reader.readyState === 2) {
          if (
            extension === "jpeg" ||
            extension === "png" ||
            extension === "jpg"
          ) {
            setImage(typeof reader.result === "string" ? reader.result : "")
          } else return toast.error("Only image is valid for profile pic")
        }
      }
    }

    reader.readAsDataURL(file)
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
          <div className="flex flex-col gap-8 md:flex-row">
            <ol className="mt-12 space-y-8 text-lg [counter-reset:howToBuy]">
              <li className={` ${listStyle}`}>
                Chat With Friends From Any where
              </li>
              <li className={` ${listStyle}`}>
                All You Need Is Just A Browser
              </li>
              <li className={` ${listStyle}`}>
                Share Any Document no limitation!!
              </li>
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
                {!HaveAccount && isSelectImage && (
                  <img
                    src={image}
                    alt="user profile pic"
                    className="h-20 w-20 rounded-full object-center"
                  />
                )}
                {!HaveAccount && (
                  <>
                    <button
                      className="focus:outline-secondary-darker ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      type="button"
                    >
                      <label htmlFor="userAvatar">Upload Image</label>
                    </button>
                    <input
                      type="file"
                      name="avatar"
                      id="userAvatar"
                      className="hidden"
                      onChange={(e) => ImageChangeHandler(e.target.files?.[0])}
                      accept="image/png, image/jpeg"
                    />
                  </>
                )}
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
                  {HaveAccount ? "Login" : "Sign Up"}
                </button>
                <div className="flex gap-1">
                  <label htmlFor="haveAccount">Not have account?</label>
                  <input
                    id="haveAccount"
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    onChange={(e) => setHaveAccount(!e.target.checked)}
                  />
                </div>
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
