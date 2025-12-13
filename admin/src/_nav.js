import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer, // Dashboard
  cilImage,       // Banner & Images
  cilText,        // Testimonial & Blogs
  cilUser,        // All User
  cilGroup,       // All Provider
  cilChatBubble,  // All Chat
  cilWallet,      // Withdraw Request
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User',
    to: '/user/all-user',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'All Distributor',
  //   to: '/distributor/all_distributor',
  //   icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'All Retailer',
  //   to: '/retailer/all_retailer',
  //   icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'All Association',
  //   to: '/association/all_association',
  //   icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Blogs',
  //   to: '/blogs/all_blogs',
  //   icon: <CIcon icon={cilText} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Inquiry',
  //   to: '/inquiry/all_inquiry',
  //   icon: <CIcon icon={cilText} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'News Room',
  //   to: '/news-room/all-news-room',
  //   icon: <CIcon icon={cilText} customClassName="nav-icon" />,
  // },
]

export default _nav
