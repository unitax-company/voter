import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import footerStyle from "assets/jss/material-dashboard-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>

        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a href="https://github.com/mrzavgorodniy" className={classes.a}>
              Mark Zavgorodniy
            </a>
            , made with love for{" "}
            <a href="https://incode-group.com" className={classes.a}>
              incode{" "}
            </a>
            :)
          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  routes: PropTypes.array
};

export default withStyles(footerStyle)(Footer);
