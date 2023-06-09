import React, { Component } from 'react'
import Credit from './Credit'
import Debt from './Debt'
import Expense from '../Expense/Expense'
import Settle from '../Settle/Settle'
import './Dashboard.css'
import { dataStore, settler, dashTransaction as transaction } from '../Store/Store'
import { connect } from "react-redux";
import { recentActivity } from '../../redux/actions';

class Dashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            debt: [],
            credit: [],
            lent: 0,
            owe: 0,
            popExpense: false,
            popSettle: false,
            allSettle: false,
            lastTransaction: 0
        }

    }
    componentDidMount() {
        this.setState({ lastTransaction: transaction.last })
    }
    componentDidUpdate(prevProps, prevState) {
        this.props.parentCallback()
        if (prevProps.user !== this.props.user) {
            this.dataExtraction();

        }
        if (prevState.lastTransaction !== transaction.last) {
            this.setState({ lastTransaction: transaction.last })
            this.dataExtraction();
        }
    }
    dataExtraction = () => {
        const user = this.props.user;
        this.setState({ credit: [], debt: [] })
        for (let index = 1; index <= transaction.last; index++) {
            if (transaction[index]) {
                if (transaction[index].paid_by === user) {
                    const shareamount = +transaction[index].amount / (transaction[index].owes.length + 1);
                    const lent = +transaction[index].amount - shareamount
                    const owesName = transaction[index].owes.join(', ')
                    this.setState(prevState => ({
                        credit: [...prevState.credit, [
                            owesName,
                            shareamount,
                            transaction[index].desc
                        ]],
                        lent: prevState.lent + lent
                    }))
                }
                if (transaction[index].owes.includes(user)) {
                    const shareamount = +transaction[index].amount / (transaction[index].owes.length + 1);
                    this.setState(prevState => ({
                        debt: [...prevState.debt, [
                            transaction[index].paid_by,
                            shareamount,
                            transaction[index].desc
                        ]],
                        owe: prevState.owe - shareamount
                    }))
                }
            }
        }
    }

    expenseHandler = () => {
        this.setState((prevState) => ({ popExpense: !prevState.popExpense }))
    }
    newExpensehandler = ({ amount, paid_by, owes, desc, popExpense, group }) => {
        if (paid_by === this.props.user) {
            const shareamount = amount / (owes.length + 1);
            const lent = amount - shareamount
            const owesName = owes.join(', ')
            this.setState(prevState => ({
                credit: [...prevState.credit, [
                    owesName,
                    shareamount
                ]],
                lent: prevState.lent + lent,
                // popExpense
            }))
        }
        if (owes.includes(this.props.user)) {
            const shareamount = amount / (owes.length + 1);
            this.setState(prevState => ({
                debt: [...prevState.debt, [
                    paid_by,
                    shareamount
                ]],
                owe: prevState.owe - shareamount,
                // popExpense
            }))
        }
        this.setState({ popExpense })
        this.dataExtraction();
        dataStore(amount, paid_by, owes, desc, group);
    }

    settleHandler = () => {
        this.setState((prevState) => ({ popSettle: !prevState.popSettle }))
    }
    settleUpHandler = (isSettled) => {

        if (isSettled) {
            settler(this.props.user)
            this.setState((prevState) => ({ popSettle: !prevState.popSettle, debt: [], credit: [], lent: 0, owe: 0 }))
        }
        else {
            this.setState((prevState) => ({ popSettle: !prevState.popSettle }))
        }
    }

    render() {
        { this.props.recentActivity({ debt: this.state.debt, credit: this.state.credit }) }
        return (
            <>
                <div>
                    <div>
                        <div className="p-3 head">

                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                                <h3>Dashboard</h3>
                                <div className="d-flex justify-content-between">
                                    <button type="button" className="btn btn-expense" onClick={this.expenseHandler}>Add an expense</button>
                                    <button type="button" className="btn btn-settle" onClick={this.settleHandler}>Settle up</button>
                                </div>
                            </div>

                            <div className="border-top border-bottom border-2">
                                <div className="row py-1 fs-6 " >
                                    <div className="col-sm-4 border-end text-center " >
                                        total balance<br />  {this.state.lent < (this.state.owe * -1) && (
                                            <span className='debt'> ₹ {(this.state.lent + this.state.owe).toFixed(2) * -1} </span>
                                        )}
                                        {this.state.lent > (this.state.owe * -1) && (
                                            <span className='credit'> ₹ {(this.state.lent + this.state.owe).toFixed(2)} </span>
                                        )}
                                    </div>
                                    <div className="col-sm-4 border-end text-center">
                                        <div> you owe  <span className='debt'>   <br /> ₹ {(this.state.owe.toFixed(2) * -1)} </span>
                                        </div>
                                    </div>
                                    <div className="col-sm-4 text-center">
                                        <div> you are owed
                                            <span className='credit'> <br /> ₹ {this.state.lent.toFixed(2)} </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="owe d-flex justify-content-between mx-4 my-2 "
                        >
                            <span>YOU OWE</span>
                            <span>YOU ARE OWED</span>
                        </div>
                        {this.state.debt.length === 0 && this.state.credit.length === 0 ? <div><img src="https://assets.splitwise.com/assets/fat_rabbit/app/checkmark-circle-ae319506ad7196dc77eede0aed720a682363d68160a6309f6ebe9ce1983e45f0.png"></img>
                            <h2>All settled</h2>
                        </div> :
                            <div className="d-flex ">
                                <span className="border-end border-1 col-6">
                                    {this.state.debt.map((data, index) => (
                                        <Debt key={index} name={data[0]} amount={data[1].toFixed(2)} />
                                    ))}
                                </span>
                                <span className="border-start border-1 col-6 " >
                                    {this.state.credit.map((data, index) => (
                                        <Credit key={index} name={data[0]} amount={data[1].toFixed(2)} />
                                    ))}
                                </span>
                            </div>
                        }


                    </div>
                </div>
                {this.state.popExpense &&
                    <Expense onBackDrop={this.expenseHandler}
                        onNewExpense={this.newExpensehandler}
                        user={this.props.user}
                    />
                }
                {this.state.popSettle &&
                    <Settle debt={this.state.debt}
                        credit={this.state.credit}
                        user={this.props.user}
                        total={this.state.lent + this.state.owe}
                        onClose={this.settleUpHandler}
                    />
                }
            </>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        recentActivity: (payload) => {
            return dispatch(recentActivity(payload))
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
