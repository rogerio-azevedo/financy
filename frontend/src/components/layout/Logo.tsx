import logo from '../../assets/logo.svg?url'

export function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="Financy" className={className} />
}
