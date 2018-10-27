import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import { verifyEmail } from "../../actions/auth";

class EmailVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      verifyCode: ""
    };
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.verifyEmail(this.state);
  };

  onChangeInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    let params = queryString.parse(this.props.location.search);
    this.setState({ email: params.email, verifyCode: params.code });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="page-container">
        <Card
          style={{
            width: "70%"
          }}
        >
          <CardHeader color="primary">
            <Typography
              variant="headline"
              style={{
                color: "#fff"
              }}
            >
              Email verification to finish registration with Voter App
            </Typography>
            <p className="form__subtitle">Please, confirm email address</p>
          </CardHeader>
          <CardBody
            style={{
              marginTop: "20px"
            }}
          >
            <form
              noValidate
              className={(classes.form, "form")}
              onSubmit={this.onSubmit}
            >
              <div className="form__content">
                <TextField
                  disabled
                  id="email-input"
                  label="Email address"
                  className={classes.textField}
                  value={this.state.email}
                  type="email"
                  name="email"
                  margin="normal"
                />
                <TextField
                  id="verification-code-input"
                  label="Verification Code"
                  disabled
                  className={classes.textField}
                  type="text"
                  name="verifyCode"
                  margin="normal"
                  value={this.state.verifyCode}
                />
                <Button
                  type="submit"
                  variant="raised"
                  style={{
                    backgroundColor: "#9c27b0",
                    color: "white",
                    alignSelf: "flex-start",
                    marginTop: "30px",
                    marginBottom: "10px",
                    textTransform: "uppercase"
                  }}
                  className={classes.submit}
                >
                  Verify email
                </Button>
              </div>
            </form>
            <Link to="/signUp">already have an account? sign-in</Link>
          </CardBody>
        </Card>
      </div>
    );
  }
}
EmailVerification.propTypes = {
  classes: PropTypes.object.isRequired,
  verifyEmail: PropTypes.func.isRequired
};

export default connect(
  null,
  { verifyEmail }
)(withStyles(dashboardStyle)(EmailVerification));
