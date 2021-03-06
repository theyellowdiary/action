import React, {Component} from 'react'
import styled from 'react-emotion'
import FieldLabel from 'universal/components/FieldLabel/FieldLabel'
import BasicInput from 'universal/components/InputField/BasicInput'
import {NewTeamFieldBlock} from './NewTeamForm'
import NewTeamFormBlock from './NewTeamFormBlock'

const FormBlockInline = styled(NewTeamFormBlock)({
  marginTop: '3rem'
})

interface Props {
  dirty: boolean
  error: string | undefined

  onChange (e: React.ChangeEvent<HTMLInputElement>): void

  teamName: string

  onBlur (e: React.FocusEvent<HTMLInputElement>): void
}

class NewTeamFormTeamName extends Component<Props> {
  render () {
    const {dirty, error, onChange, onBlur, teamName} = this.props
    return (
      <FormBlockInline>
        <FieldLabel fieldSize='medium' htmlFor='teamName' indent inline label='Team Name' />
        <NewTeamFieldBlock>
          <BasicInput
            error={dirty ? (error as string) : undefined}
            name='teamName'
            onBlur={onBlur}
            onChange={onChange}
            value={teamName}
          />
        </NewTeamFieldBlock>
      </FormBlockInline>
    )
  }
}

export default NewTeamFormTeamName
