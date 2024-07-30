import Link from 'next/link'
import Image from "next/image"

const HeaderLogo = () => {
  return (
    <Link href="/">
        <div className='items-center hidden lg:flex'> 
            <Image src="/logo.jpeg" alt="logo" width={28} height={28} className='rounded-full' />
            <p className='font-semibold text-white text-2xl ml-2.5'>Finanace</p>
        </div> 
    </Link>
  )
}

export default HeaderLogo