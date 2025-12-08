import SocketDemo from '../components/SocketDemo'

export default function Home() {
  return (
    <section className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Project 5</h1>
      <p className="text-gray-600">Next.js + TypeScript + Tailwind scaffold</p>

      <div className="mt-8">
        <SocketDemo />
      </div>
    </section>
  )
}
