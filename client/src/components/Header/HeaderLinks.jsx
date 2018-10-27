import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Dropdown from "../Dropdown";

import { logoutUser } from "../../actions/auth";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";

class HeaderLinks extends React.Component {
  state = {
    open: false,
    menuList: [
      {
        title: "Logout",
        handleClick: this.props.logoutUser
      }
    ]
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        {this.props.auth.isAuthenticated && this.props.auth.user.email}
        <Dropdown menuList={this.state.menuList}>
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Dropdown>
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withStyles(headerLinksStyle)(HeaderLinks));
