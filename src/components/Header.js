import React, { Component } from "react";

import { connect } from "react-redux";
import { updateUser } from '../redux/actions';

class Header extends Component {

    userHandler = (event) => {
        const user = event.target.value;
        this.props.updateUser(user)        
    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ padding: "0px" }}>
                    <div className="container-fluid " style={{ backgroundColor: "#07e2b3" }}>
                        <div className='d-flex justify-content-between align-items-center' style={{ width: '100%' }}>
                            <a className="navbar-brand px-1" href="#" >
                                Splitwise
                            </a>
                            <div className='mobile'>
                                <button class="btn btn-primary " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style={{ backgroundColor: "#07e2b3" }}>
                                    <i class="fas fa-align-justify"></i>
                                </button>
                            </div>
                        </div>
                        <div className='lapview bg-transparent'>
                            <select className="form-select-md bg-transparent me-5" style={{border:"none",appearance: "none",color:"white",cursor:'pointer'}} aria-label="Default select example" onChange={this.userHandler}>
                                <option value="ajay" style={{fill:'blue'}} selected>ajay</option>
                                <option value="harsh">Harsh</option>
                                <option value="pravin">Pravin</option>
                            </select>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateUser: (payload) => {
            return dispatch(updateUser(payload))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
