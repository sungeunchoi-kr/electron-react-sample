const { useEffect, useRef } = require('react')

const Sentry = require("@sentry/react")

function causeException() {
    const a = null
    a.b = true
}

function FallbackComponent() {
    return <div>An error has ocurred :(</div>
}

function causeUnhandledRejection() {
    function promise() {
        return new Promise((resolve, _) => {
            setTimeout(() => {
                return resolve()
            }, 1000)
        })
    }

    promise().then(() => {
        const a = undefined
        a.b = true
    })
}

function App() {

    return (
        <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
            <Component />
        </Sentry.ErrorBoundary>
    );
}

function Component() {

    const triggerError = useRef(false)

    useEffect(() => {
        setInterval(() => {
            if (triggerError.current === true) {
                causeException()
                triggerError.current = false
            }
        }, 1000)
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Electron Sentry Test
                </p>

                <button
                    onClick={() => {
                        causeException()
                    }}
                >causeException
                </button>

                <button
                    onClick={() => {
                        causeUnhandledRejection()
                    }}
                >causeUnhandledRejection</button>

                <button
                    onClick={() => {
                        triggerError.current = true
                    }}
                >set effect error</button>
            </header>
        </div>
    );

}

export default App;
