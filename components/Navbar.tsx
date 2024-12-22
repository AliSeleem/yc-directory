import { auth, signIn, signOut } from '@/auth'
import { BadgePlus, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'

const Navbar = async () => {
  const session = await auth()
  return (
        <header className="px-5 py-3">
          <nav className="flex justify-between items-center">
            <Link href={'/'}>
              <Image
                src="/logo.png"
                alt="logo"
                width={144}
                height={30}
              />
            </Link>

            <div className="flex items-center gap-5 text-black">
              {session && session?.user? 
                <>
                  <Link href="/startup/create">
                    <span className='max-sm:hidden'>create</span>
                    <BadgePlus className='size-6 sm:hidden'/>
                  </Link>

                  <form className='flex items-center' action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/"})
                  }}>
                    <button type="submit">
                      <span className='max-sm:hidden'>logout</span>
                      <LogOut className='size-6 sm:hidden'/>
                    </button>
                  </form>
                  
                  <Link href={`/user/${session?.id}`}>
                    <Avatar className='size-10'>
                      <AvatarImage 
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                  </Link>
                </>
                :
                <>
                  <form action={async () => {
                    "use server";

                    await signIn('github')
                  }}>
                    <button type="submit">login</button>
                  </form>
                </> 
              }
            </div>
          </nav>
        </header>
  )
}

export default Navbar