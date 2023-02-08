import { Comment } from "react-loader-spinner"

const SkeletonHolder = () => {
  return (
    <div className="grid h-screen place-items-center">
      <Comment
        visible={true}
        height="200"
        width="200"
        ariaLabel="comment-loading"
        wrapperStyle={{}}
        wrapperClass="comment-wrapper"
        color="#fff"
        backgroundColor="rgb(6, 95, 70)"
      />
    </div>
  )
}

export default SkeletonHolder
