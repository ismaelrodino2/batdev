import { ReactNode } from 'react'

type Props = {
    children?: ReactNode
}
const DateCircle: React.FC<Props> = ({ children }) => (
    <div className="flex rounded-full h-[100px] text-gray items-center justify-center bg-white w-[100px]">
        {children}
    </div>
)

export default DateCircle
