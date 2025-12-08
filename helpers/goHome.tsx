export function GoHome() {
    const goHome = () => {
        setTimeout(() => {
            window.location.href = '/'
        }, 0);
    }
    return (
        <button onClick={goHome} className='bg-sky-500 rounded-2xl p-4 mb-4'>Home</button>
    )
}