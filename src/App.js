import { useEffect, useState } from "react"


function App() {

    const [value, setValue] = useState('')
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)
    // const [uniqueTitles, setUniqueTitles] = useState([]);

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const handleClick = (title) => {
        setCurrentTitle(title)
        setMessage(null)
        setValue("")
    }

    const getMessages = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value
            }),
            headers: {
                "Content-type": "application/json"
            }
        }
        try {
            const response = await fetch("http://localhost:8000/completion", options)
            const data = await response.json()
            setMessage(data.choices[0].message)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log(currentTitle, value, message)
        if (!currentTitle && value && message) {
            setCurrentTitle(value)
        }
        if (currentTitle && value && message) {
            setPreviousChats((prevChats) => {
                return [...prevChats,
                {
                    title: currentTitle,
                    role: 'user',
                    content: value
                }, {
                    title: currentTitle,
                    role: message.role,
                    content: message.content
                }
                ]
            })
        }
    }, [message, currentTitle])

    console.log(previousChats)
    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
    const uniqueTitle = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
    console.log(uniqueTitle)

    return (
        <div className="App">
            <section className="side-bar">
                <button onClick={createNewChat}>+ New chat</button>
                <ul className="history">
                    {uniqueTitle?.map((title, index) => <li key={index} onClick={() => handleClick(title)}>{title}</li>)}
                </ul>
                <nav>
                    <p>Made by Vishnu</p>
                </nav>
            </section>
            <section className="main">
                {!currentTitle && <h1>Chat</h1>}
                <ul className="feed">
                    {currentChat.map((chatMessage, index) => <li key={index}>
                        <p className="role">{chatMessage.role}</p>
                        <p>{chatMessage.content}</p>
                    </li>)}
                </ul>
                <div className="bottom-section">
                    <div className="input-container">
                        <input value={value} onChange={(e) => setValue(e.target.value)} />
                        <div id="submit" onClick={getMessages}>➢</div>
                    </div>
                    <p className="info">
                        Chat GPt Mar 14 version. Free Research Preview.
                        Our goal is to make AI systems more natural and safe to interact with,
                        Your feedback will help us improve
                    </p>
                </div>
            </section>
        </div>
    );
}

export default App;
