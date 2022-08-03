import Header from '../components/Header'

function Contact() {
    return (
        <div className=" bg-white px-8 pb-5">
            <div className="bg-neutral-low-high ">
                <div className="px-[42px] container mx-auto">
                    <Header firstTxt="About Me" title="A LITTLE BIT" />
                    <div className="flex text-center pb-11 justify-center">
                        <div className=" w-1/2">
                            <p>
                                Hello, nice to meet you, thanks for visiting my
                                blog. Below you can read a little more about me.
                            </p>
                        </div>
                    </div>
                    <div className="flex md:flex-row  flex-col items-center pb-10">
                        <div className="md:w-1/4 w-full">
                            <h4 className="my-4">Who I Am</h4>
                            <p className="leading-[2.25em]">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Veritatis amet ipsam eum
                                similique? Alias atque harum nisi neque?
                                Quisquam ut ipsum iste amet ea unde beatae animi
                                ipsa atque officiis.
                            </p>
                        </div>
                        <div className="md:w-[60%] w-full flex justify-center py-10 flex-col items-center gap-16">
                            <img
                                src="/image/me.png"
                                alt="Image of me"
                                className="w-[340px] h-[340px] rounded-full"
                            />
                            <hr className=" border-solid border-primary-medium w-16 self-center" />
                        </div>

                        <div className="md:w-1/4 w-full">
                            <h4 className="mb-4">My Philosophy</h4>
                            <p className="leading-[2.25em]">
                                Lorem ipsum dolor sit amet consectetur,
                                adipisicing elit. Culpa voluptatibus laboriosam
                                repudiandae placeat dolorum vel eos quasi odit
                                alias distinctio quisquam illum dolorem error
                                ad, a molestiae explicabo quam. Distinctio?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
