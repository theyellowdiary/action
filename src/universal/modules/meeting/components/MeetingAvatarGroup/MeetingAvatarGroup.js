import {css} from 'aphrodite-local-styles/no-important'
import PropTypes from 'prop-types'
import React from 'react'
import Avatar from 'universal/components/Avatar/Avatar'
import Tag from 'universal/components/Tag/Tag'
import appTheme from 'universal/styles/theme/appTheme'
import defaultUserAvatar from 'universal/styles/theme/images/avatar-user.svg'
import ui, {
  DEFAULT_MENU_HEIGHT,
  DEFAULT_MENU_WIDTH,
  HUMAN_ADDICTION_THRESH,
  MAX_WAIT_TIME
} from 'universal/styles/ui'
import withStyles from 'universal/styles/withStyles'
import {CHECKIN, phaseArray, UPDATES} from 'universal/utils/constants'
import withAtmosphere from 'universal/decorators/withAtmosphere/withAtmosphere'
import RequestFacilitatorMutation from 'universal/mutations/RequestFacilitatorMutation'
import PromoteFacilitatorMutation from 'universal/mutations/PromoteFacilitatorMutation'
import {createFragmentContainer} from 'react-relay'
import Loadable from 'react-loadable'
import LoadableLoading from 'universal/components/LoadableLoading'
import LoadableMenu from 'universal/components/LoadableMenu'
import AddTeamMemberAvatarButton from 'universal/components/AddTeamMemberAvatarButton'

const LoadableMeetingAvatarMenu = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'MeetingAvatarMenu' */
      'universal/modules/meeting/components/MeetingAvatarMenu'),
  loading: (props) => (
    <LoadableLoading {...props} height={DEFAULT_MENU_HEIGHT} width={DEFAULT_MENU_WIDTH} />
  ),
  delay: HUMAN_ADDICTION_THRESH,
  timeout: MAX_WAIT_TIME
})

const originAnchor = {
  vertical: 'bottom',
  horizontal: 'right'
}

const targetAnchor = {
  vertical: 'top',
  horizontal: 'right'
}

const MeetingAvatarGroup = (props) => {
  const {atmosphere, gotoItem, isFacilitating, localPhase, localPhaseItem, styles, team} = props
  const {activeFacilitator, teamId, facilitatorPhase, facilitatorPhaseItem, teamMembers} = team
  const onFacilitatorPhase = facilitatorPhase === localPhase
  const canNavigate = localPhase === CHECKIN || localPhase === UPDATES
  return (
    <div className={css(styles.meetingAvatarGroupRoot)}>
      <div className={css(styles.meetingAvatarGroupInner)}>
        {teamMembers.map((avatar, idx) => {
          const {isConnected, isSelf} = avatar
          const picture = avatar.picture || defaultUserAvatar
          const count = idx + 1
          const itemStyles = css(styles.item, !canNavigate && styles.itemReadOnly)
          const avatarBlockStyles = css(
            styles.avatarBlock,
            count === localPhaseItem && styles.avatarBlockLocal,
            count === facilitatorPhaseItem && onFacilitatorPhase && styles.avatarBlockFacilitator,
            !canNavigate && styles.avatarBlockReadOnly
          )
          const tagBlockStyles = css(styles.tagBlock, !canNavigate && styles.tagBlockReadOnly)
          const navigateTo = () => {
            gotoItem(count)
          }
          const promoteToFacilitator = () => {
            PromoteFacilitatorMutation(atmosphere, {facilitatorId: avatar.id}, {})
          }
          const requestFacilitator = () => {
            RequestFacilitatorMutation(atmosphere, teamId)
          }
          const avatarIsFacilitating = activeFacilitator === avatar.id
          const handleNavigate = (canNavigate && navigateTo) || undefined
          const handlePromote =
            (isFacilitating && !isSelf && isConnected && promoteToFacilitator) || undefined
          const handleRequest = (avatarIsFacilitating && !isSelf && requestFacilitator) || undefined
          return (
            <div className={itemStyles} key={avatar.id}>
              <div className={avatarBlockStyles}>
                <LoadableMenu
                  LoadableComponent={LoadableMeetingAvatarMenu}
                  maxWidth={350}
                  maxHeight={225}
                  originAnchor={originAnchor}
                  queryVars={{
                    handleNavigate,
                    handlePromote,
                    handleRequest,
                    avatar,
                    localPhase
                  }}
                  targetAnchor={targetAnchor}
                  toggle={
                    <Avatar
                      hasBadge
                      isClickable
                      picture={picture}
                      isConnected={avatar.isConnected || avatar.isSelf}
                      isCheckedIn={avatar.isCheckedIn}
                      size='fill'
                    />
                  }
                />
              </div>
              {avatarIsFacilitating && (
                <div className={tagBlockStyles}>
                  <Tag colorPalette='gray' label='Facilitator' />
                </div>
              )}
            </div>
          )
        })}
        <AddTeamMemberAvatarButton isMeeting team={team} teamMembers={teamMembers} />
      </div>
    </div>
  )
}

MeetingAvatarGroup.propTypes = {
  atmosphere: PropTypes.object.isRequired,
  gotoItem: PropTypes.func.isRequired,
  isFacilitating: PropTypes.bool,
  localPhase: PropTypes.oneOf(phaseArray),
  localPhaseItem: PropTypes.number,
  styles: PropTypes.object,
  team: PropTypes.object.isRequired
}

const borderActive = appTheme.brand.secondary.yellow
const borderLocal = appTheme.palette.mid30l
const boxShadowBase = '0 0 0 2px #fff, 0 0 0 4px'
const boxShadowWarm = `${boxShadowBase} ${borderActive}`
const boxShadowLocal = `${boxShadowBase} ${borderLocal}`

const styleThunk = () => ({
  meetingAvatarGroupRoot: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: '1rem 0'
  },

  meetingAvatarGroupInner: {
    display: 'flex',
    position: 'relative',
    textAlign: 'center'
  },

  item: {
    marginLeft: '1rem',
    marginRight: '.25rem',
    position: 'relative'
  },

  itemReadOnly: {
    // Define
  },

  avatarBlock: {
    borderRadius: '100%',
    width: '2.25rem',

    [ui.breakpoint.wide]: {
      width: '2.5rem'
    },
    [ui.breakpoint.wider]: {
      width: '3rem'
    },
    [ui.breakpoint.widest]: {
      width: '4rem'
    },

    ':hover': {
      opacity: '.5'
    }
  },

  avatarBlockLocal: {
    boxShadow: boxShadowLocal
  },

  avatarBlockFacilitator: {
    boxShadow: boxShadowWarm
  },

  avatarBlockReadOnly: {
    boxShadow: 'none',

    ':hover': {
      opacity: '1'
    }
  },

  tagBlock: {
    bottom: '-1.75rem',
    left: '50%',
    paddingRight: ui.tagGutter,
    position: 'absolute',
    transform: 'translateX(-50%)'
  },

  tagBlockReadOnly: {
    // Define
  }
})

export default createFragmentContainer(
  withAtmosphere(withStyles(styleThunk)(MeetingAvatarGroup)),
  graphql`
    fragment MeetingAvatarGroup_team on Team {
      teamId: id
      activeFacilitator
      facilitatorPhase
      facilitatorPhaseItem
      ...AddTeamMemberModal_team
      teamMembers(sortBy: "checkInOrder") {
        ...AddTeamMemberModal_teamMembers
        id
        isCheckedIn
        isConnected
        isSelf
        picture
        ...MeetingAvatarMenu_avatar
      }
    }
  `
)
