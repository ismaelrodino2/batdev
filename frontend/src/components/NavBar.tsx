import Link from 'next/link'
import { destroyCookie } from 'nookies'
import { FunctionComponent, useContext, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { AuthContext } from '../contexts/AuthContext'
import { SearchContext } from '../contexts/SearchContext'

const NavBar: FunctionComponent = () => {
    const [active, setActive] = useState<'auto' | number | `${number}%`>(0)
    const [activeUser, setActiveUser] = useState<
        'auto' | number | `${number}%`
    >(0)
    const [activeSearch, setActiveSearch] = useState<
        'auto' | number | `${number}%`
    >(0)

    const { isAuthenticated, userData } = useContext(AuthContext) // chamo mas ele só faz a requisição quando muda o token ou a página é atualizada (useEffect)
    // const { "nextauth.token": token } = parseCookies();
    const { setSearchValue } = useContext(SearchContext)

    console.log('está autenticado', isAuthenticated())
    console.log(activeUser)
    const logout = () => {
        destroyCookie({}, 'nextauth.token')
        window.location.reload()
    }
    console.log('userdata', userData)

    return (
        <div className="bg-white px-5">
            <style jsx>
                {`
                    .custom-underline::after {
                        content: '';
                        position: absolute;
                    }

                    .box-animation .custom-underline::after {
                        top: 120%;
                        height: 1px !important;
                        width: 40%;
                        left: 30%;
                        transition: 0.4s ease-out all 0.1s;
                        background-color: #222222;
                        transition: 0.3s ease all 0.1s;
                    }

                    .box {
                        transition: all 2s ease-in-out;
                    }

                    .box:hover {
                        cursor: pointer;
                    }

                    .box-animation:hover .custom-underline::after {
                        width: 100%;
                        left: 0%;
                        background-color: #74c2bd;
                        transition: 0.5s ease all;
                    }
                `}
            </style>
            <ul className="flex items-center flex-wrap font-extrabold raleway text-[13px] min-h-16 py-3">
                <li className="flex md:hidden items-center w-full md:w-1/3 justify-center md:order-2 py-2 md:py-0 ">
                    <h2 className="cursor-pointer transition-opacity duration-300 ease-in-out opacity-100 hover:opacity-60">
                        <Link href="/">Batdev</Link>
                    </h2>
                </li>
                <div className="flex w-full justify-between items-center">
                    <li className="uppercase w-auto flex md:w-1/3 justify-center md:justify-start md:order-1 tracking-[2px]">
                        <div className="box-animation">
                            <span
                                className="custom-underline relative inline-block cursor-pointer transition-colors duration-300 ease-in-out text-primary hover:text-primary-medium"
                                onClick={() => {
                                    setActiveSearch(
                                        activeSearch === 0 ? 'auto' : 0
                                    )
                                    setActive(0)
                                    setActiveUser(0)
                                }}
                            >
                                search
                            </span>
                        </div>
                    </li>

                    <li className="md:flex hidden items-center w-full md:w-1/3 justify-center md:order-2 py-2 md:py-0 ">
                        <h2 className="cursor-pointer transition-opacity duration-300 ease-in-out opacity-100 hover:opacity-60">
                            <Link href="/">Batdev</Link>
                        </h2>
                    </li>

                    <ul className="md:flex contents w-auto justify-center md:justify-end md:w-1/3 md:order-3 tracking-[2px] items-center">
                        <li className="uppercase px-[15px] ">
                            {isAuthenticated() && (
                                <img
                                    onClick={() => {
                                        setActiveUser(
                                            activeUser === 0 ? 'auto' : 0
                                        )
                                        setActiveSearch(0)
                                        setActive(0)
                                    }}
                                    className="h-[30px] w-[30px] cursor-pointer rounded-full border border-[transparent] hover:border-primary-medium"
                                    src={userData && userData.profilePic}
                                    alt={`Profile pic of ${
                                        userData && userData.name
                                    }`}
                                />
                            )}
                            {!isAuthenticated() && (
                                <div className="box-animation">
                                    <span className="custom-underline relative inline-block text-center transition-colors duration-300 ease-in-out text-primary hover:text-primary-medium cursor-pointer">
                                        <Link href="/login">sign in</Link>
                                    </span>
                                </div>
                            )}
                        </li>
                        <li className="uppercase px-[15px]  ">
                            <div className="box-animation">
                                <span
                                    className="custom-underline relative inline-block text-center transition-colors duration-300 ease-in-out text-primary hover:text-primary-medium cursor-pointer"
                                    onClick={() => {
                                        setActive(active === 0 ? 'auto' : 0)
                                        setActiveSearch(0)
                                        setActiveUser(0)
                                    }}
                                >
                                    menu
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </ul>

            <AnimateHeight duration={500} height={active}>
                <ul className="flex flex-col md:flex-row md:justify-center">
                    <Link href="/">
                        <li className=" px-[15px] hover:text-primary-medium cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-neutral-low-high">
                            Home
                        </li>
                    </Link>
                    {isAuthenticated() && (
                        <Link href="/write">
                            <li className=" px-[15px] hover:text-primary-medium cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-neutral-low-high">
                                Write
                            </li>
                        </Link>
                    )}
                    {isAuthenticated() && (
                        <Link href="/myposts">
                            <li className=" px-[15px] hover:text-primary-medium cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-neutral-low-high">
                                my posts
                            </li>
                        </Link>
                    )}
                    {isAuthenticated() && (
                        <Link href="/categories">
                            <li className=" px-[15px] hover:text-primary-medium cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-neutral-low-high">
                                categories
                            </li>
                        </Link>
                    )}
                    {isAuthenticated() && (
                        <Link href="/aboutme">
                            <li className=" px-[15px] hover:text-primary-medium cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-neutral-low-high">
                                About me
                            </li>
                        </Link>
                    )}
                    <Link href="/contact">
                        <li className=" px-[15px] hover:text-primary-medium cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-neutral-low-high">
                            Contact
                        </li>
                    </Link>
                </ul>
            </AnimateHeight>

            <AnimateHeight duration={500} height={activeUser}>
                <div className="flex justify-center">
                    <ul className="py-1">
                        <Link href="/aboutme">
                            <li className="px-[15px] hover:text-primary-medium cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[13px] bg-neutral-low-high">
                                My profile
                            </li>
                        </Link>
                        <li
                            onClick={logout}
                            className="px-[15px] hover:text-primary-medium cursor-pointer py-[19px] my-[1px] md:my-0 md:bg-white uppercase tracking-[1px] text-[12px] bg-neutral-low-high flex justify-center"
                        >
                            Sign out
                        </li>
                    </ul>
                </div>
            </AnimateHeight>

            <AnimateHeight duration={500} height={activeSearch}>
                <div className="flex justify-center">
                    <input
                        type="text"
                        placeholder="Search and hit enter ..."
                        className="outline-none py-4 text-center"
                        onChange={e => setSearchValue(e.target.value)}
                    />
                </div>
            </AnimateHeight>
        </div>
    )
}

export default NavBar
