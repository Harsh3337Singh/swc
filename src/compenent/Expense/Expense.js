import React, { Component } from 'react'
import BackDrop from '../UI/BackDrop'
import style from './Expense.module.css'
import Share from './Share'
import Cards from '../UI/Cards'

class Expense extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name:'',
            nameList: [],
            paid: 'you',
            owe: '',
            share: 'equally',
            shareamount: 0.00,
            group: 'No group',
            splitShare: false,
            amount: 0,
            description: '',
            err: ''
        }
    }

    shareHandler = () => {
        this.setState((prevState) => ({ splitShare: !prevState.splitShare }))
    }
    nameHandler = (event) => {
        const name = event.target.value;
        if (!this.state.nameList.includes(name)) {
            this.setState(prevState => ({
                nameList: [...prevState.nameList, name],
                name:''
                // shareamount: prevState.amount / this.state.nameList.length
            }))
        }
    }
    nameRemover = (event) => {
        const nameList = event.target.value;
        console.log(nameList)
    }
    amountHandler = (event) => {
        const amount = event.target.value;
        if (!isNaN(amount) && this.state.nameList.length !== 0) {
            const length = this.state.nameList.length;
            this.setState({ amount, shareamount: amount / length, err: '' })
        }
        else {
            this.setState({ err: 'form-control is-invalid', amount: 0, shareamount: 0 })
        }
    }

    descriptionHandler = (event) => {
        const description = event.target.value;
        this.setState({ description })
    }
    nameChange=(event)=>{
        this.setState({name:event.target.value})
    }
    formHandler = (event) => {
        event.preventDefault();
        if (this.state.err === '') {
            const length = this.state.nameList.length;
            this.setState((prevState) => ({ shareamount: prevState.amount / length }));
            this.props.onNewExpense({})
        }
    }
    render() {
        return (
            <>
                <BackDrop>
                    <Cards>
                        <header
                            className='d-flex justify-content-between align-items-center
                             px-2 py-1 fs-5 fw-bold rounded-top-3'
                            style={{ background: '#07e2b3', color: "white" }}
                        >
                            <span>Add an expense</span>
                            <i class="fas fa-times" onClick={this.props.onBackDrop}></i>
                        </header>
                        <form onSubmit={this.formHandler}>
                            <div className='d-flex'>
                                <div className='row p-1'>
                                    <div className='col-5'> With you and :</div>
                                    <input type='text' className='col-6' placeholder='Enter the name'
                                        onBlur={this.nameHandler} onChange={this.nameChange} value={this.state.name} />
                                    <div className='d-flex flex-wrap'>
                                        {this.state.nameList.map((name, index) => (
                                            <div key={index} className='m-2 px-2 border border-2 rounded-pill' >
                                                {name}
                                                {/* <i class="fas fa-times" /> */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='d-flex ps-3 pe-1'>
                                <img src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png" class="category" alt="img" width='70px' height='70px' className='rounded-3' />
                                <div className='ps-2'>
                                    <input type='text' className='col-9 mb-2'
                                        placeholder='Enter a description' onBlur={this.descriptionHandler}>

                                    </input>
                                    <br />
                                    ₹<input type='number' className={'col-8' + this.state.err} placeholder='0.00' onBlur={this.amountHandler}></input>
                                    {this.state.err !== '' && <div className='valid-feedback'> enter the proper amount</div>}
                                </div>
                            </div>
                            <div className='my-2 px-3'>
                                <div className='text-center'>
                                    Paid by <span className={style.share}>{this.state.paid}</span> and split
                                    <span className={style.share} onClick={this.shareHandler}> {this.state.share}</span>
                                </div>
                                <div className='text-center'>({this.state.shareamount}/person)</div>
                            </div>
                            <div className={style.btn}>
                                <button type='button' >{this.state.group}</button>
                            </div>
                        </form>
                        <hr />
                        <div >
                            <div className='row d-flex justify-content-end m-2'>
                                <button type='button'
                                    className='btn btn-outline-secondary bg-opacity-10 col-3 me-2'
                                    onClick={this.props.onBackDrop}
                                >
                                    Cancel
                                </button>
                                <button type='submit' className='btn px-3 btn-settle col-3 me-2'>Save</button>
                            </div>
                        </div>
                    </Cards>
                </BackDrop>
                {this.state.splitShare && <Share onClick={this.shareHandler} nameList={this.state.nameList} />}
            </>
        )
    }
}

export default Expense
