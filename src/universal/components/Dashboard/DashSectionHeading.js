import PropTypes from 'prop-types'
import React from 'react'
import ui from 'universal/styles/ui'
import Type from 'universal/components/Type/Type'
import styled from 'react-emotion'
import Icon from 'universal/components/Icon'
import {MD_ICONS_SIZE_18} from 'universal/styles/icons'

const RootBlock = styled('div')(({margin}) => ({
  alignItems: 'center',
  display: 'flex',
  margin: margin || 0,
  whiteSpace: 'nowrap'
}))

const StyledIcon = styled(Icon)({
  color: ui.colorText,
  fontSize: MD_ICONS_SIZE_18,
  marginRight: '.5rem'
})

const DashSectionHeading = (props) => {
  const {icon, label, margin} = props
  return (
    <RootBlock margin={margin}>
      {icon && <StyledIcon>{icon}</StyledIcon>}
      <Type lineHeight='2rem' scale='s4' colorPalette='dark'>
        {label}
      </Type>
    </RootBlock>
  )
}

DashSectionHeading.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  margin: PropTypes.string
}

export default DashSectionHeading
