import { Dispatch, SetStateAction, useState } from "react"
import AppDialog from "./Dialog"

type Props = {
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>
  isDialogOpen: boolean
  title: string
  btnText: string
  handleSubmit: (username: string) => void
  fieldTitle: string
  preventClose?: boolean
}

const UsernameDialog = ({
  title,
  btnText,
  isDialogOpen,
  setIsDialogOpen,
  handleSubmit,
  fieldTitle,
  preventClose = false,
}: Props) => {
  const [username, setUsername] = useState("")
  return (
    <AppDialog
      isOpen={isDialogOpen}
      setIsOpen={setIsDialogOpen}
      title={title}
      preventClose={preventClose}
    >
      <form
        className="mt-3 space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(username)
        }}
      >
        <div className="form-control w-full">
          <label className="label" htmlFor="name">
            <span className="label-text font-medium text-zinc-900">
              {fieldTitle}
            </span>
          </label>
          <input
            type="text"
            className="input-bordered input w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button className="btn-primary btn" type="submit">
          {btnText}
        </button>
      </form>
    </AppDialog>
  )
}

export default UsernameDialog
