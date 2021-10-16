import React, { Component } from "react";
import UserBlock from "./UserBlock";
import { dashTransaction as transactionData } from '../Store/Store'
const userData = require("../../data/user.json");
// const transactionData = require("../../data/transaction.json");
export default class UserUi extends Component {
    constructor(props) {
        super(props);

        this.state = {
            img1: "https://s3.amazonaws.com/splitwise/uploads/notifications/v2021/0-18.png",
            uname: "",
            paidBy: [],
            amount: [],
            desc: [],
            sharedBy: [],
            temp: -1,
            transactions: [],
            sort: false,
            count: 0,
        };
    }

    componentDidMount() {
        this.updateData();
    }

    componentDidUpdate() {
        this.updateData();
        if (!this.state.sort) {
            this.setState((prevState) => ({
                transactions: [...new Set(this.state.transactions)],
                sort: true,
            }));
        }
        if (
            this.state.transactions.length !== this.state.count &&
            this.state.sort
        ) {
            this.addData();
        }
    }

    addData = () => {
        this.state.transactions.map((element) => {
            if (transactionData[element]) {
                if (transactionData[element]["owes"].includes(this.props.userName) || transactionData[element]["paid_by"] === this.props.userName) {
                    this.setState((prevState) => ({
                        paidBy: [...prevState.paidBy, transactionData[element].paid_by],
                        amount: [...prevState.amount, transactionData[element].amount],
                        desc: [...prevState.desc, transactionData[element].desc],
                        sharedBy: [
                            ...prevState.sharedBy,
                            transactionData[element]["owes"].length,
                        ],
                        count: this.state.transactions.length,
                    }));
                }
            }
        });
    };

    updateData = () => {
        if (userData[this.props.userName]) {
            if (this.props.userName !== this.state.uname) {
                this.setState({
                    uname: "",
                    paidBy: [],
                    amount: [],
                    desc: [],
                    temp: -1,
                    transactions: [],
                    sort: false,
                    count: 0,
                });
                for (let key in userData[this.props.userName]) {
                    if (key !== "owes") {
                        this.setState((prevState) => ({
                            temp: prevState.transactions.length,
                            transactions: [
                                ...prevState.transactions,
                                ...userData[this.props.userName][key],
                            ],
                            uname: this.props.userName,
                            sort: false,
                        }));
                    }
                }
                for (let element of userData[this.props.userName]["owes"]) {
                    // if(transactionData[])
                    this.setState((prevState) => ({
                        temp: prevState.transactions.length,
                        transactions: [
                            ...prevState.transactions,
                            ...userData[element][this.props.userName],
                        ],
                        uname: this.props.userName,
                    }));
                }
            }
        }
    };

    render() {
        return (
            <div>
                <h2 className="groupHead d-flex justify-content-between">
                    <div>
                        <img
                            src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-ruby36-100px.png"
                            alt="#"
                            className="rounded-circle"
                            width="30px"
                            height="30px"
                            style={{ marginRight: "10px" }}
                        ></img>
                        {this.props.userName}
                    </div>
                </h2>
                {/* {this.state.paid_by */}
                {this.state.paidBy.length === 0 ? <div><img src="https://assets.splitwise.com/assets/fat_rabbit/app/checkmark-circle-ae319506ad7196dc77eede0aed720a682363d68160a6309f6ebe9ce1983e45f0.png"></img>
                    <h2>All settled</h2>
                </div> :

                    this.state.paidBy.map((person, index) => (
                        <UserBlock
                            img={this.state.img1}
                            paidBy={person}
                            amount={this.state.amount[index]}
                            desc={this.state.desc[index]}
                            sharedBy={this.state.sharedBy[index]}
                        />
                    ))}
            </div>
        );
    }
}
