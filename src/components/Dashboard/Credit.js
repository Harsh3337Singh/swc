import './Dashboard.css'
function Credit(props) {
    return (
        <>
        {/* {console.log("IN credit",props.name)} */}
            <div className="d-flex flex-wrap align-items-center justify-content-center px-4 py-3">
                <img
                    src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-ruby36-100px.png"
                    alt="Avatar" className='rounded-circle' width='40px' height='40px'
                />
                <div className='px-3 my-1'>{props.name}
                    <div className='credit'>owe you INR {props.amount}</div>
                </div>
            </div>

        </>
    )
}

export default Credit