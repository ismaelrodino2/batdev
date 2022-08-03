import { ImSpinner2 } from 'react-icons/im/index'

const Spinner = () => {
    return (
        <div
            className="absolute h-screen  w-full flex justify-center items-center"
            role="status"
        >
            <div role="status">
                <ImSpinner2 className="animate-spin text-5xl text-primary" />
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner
