import Link from 'next/link';
import Image from 'next/image';

// backgroundColor: '#E5E9FF'

function Navbar() {
  return (
    <nav className='text-lg font-bold p-4 shadow-xs bg-slate-100' style={{ color: '#011B3D' }}>
      <ul className='flex justify-between'>
        <li>
          <Link href="/" className='flex items-center'  >
            <Image src="/images/logo.png" alt="Logo" width={50} height={50}/>
            Inicio
          </Link>
        </li>
        <li className='my-auto'>
          <Link href="/auth/login">
            Iniciar sesión
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar