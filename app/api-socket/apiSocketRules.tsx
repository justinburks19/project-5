"use client";
export default function ApiSocketRules() {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">API Socket Rules</h2>
            <p className="mb-2">This section outlines the rules and guidelines for using the Socket.io API in this project.</p>
            <ul className="list-disc list-inside">
                <li className="mb-1">Use <code>socket.emit(event, data)</code> to send data to the server.</li>
                <li className="mb-1">Use <code>socket.on(event, callback)</code> to listen for events from the server.</li>
                <li className="mb-1">Use <code>socket.disconnect()</code> to disconnect from the server when no longer needed.</li>
                <li className="mb-1">Ensure proper error handling for all socket events.</li>
                <li className="
mb-1">Maintain a clean and organized code structure for socket interactions.</li>
            </ul>
        </div>
    )
}