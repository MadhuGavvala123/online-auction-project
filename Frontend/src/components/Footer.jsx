import React from 'react'
import './Footer.css'

function footer() {
  return (
    <div className="footer-cls">
     
    <footer>
      <p>© {new Date().getFullYear()} Online Auctioning. All rights reserved.</p>
      <p className="footer-description">
              Your trusted platform for seamless online bidding and auction experiences.
            </p>
    </footer>
 

    </div>
  )
}

export default footer
