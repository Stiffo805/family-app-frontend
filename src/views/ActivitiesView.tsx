import useGetActivitiesSummary from '@src/api/hooks/useGetActivitiesSummary'
import useGetFamilyMembers from '@src/api/hooks/useGetFamilyMembers'
import ActivitySummary from '@src/components/activities/ActivitySummary'
import ActivitySummaryBarChart from '@src/components/activities/ActivitySummaryBarChart'
import GoBackArrow from '@src/components/GoBackArrow'
import styles from '@src/views/ActivitiesView.module.css'
import { useState } from 'react'

const ActivitiesView = () => {
  const [selectedMemberId, setSelectedMemberId] = useState(0)

  const { data: members } = useGetFamilyMembers()
  const { data: activitySummary } = useGetActivitiesSummary({
    familyMemberId: selectedMemberId
  })

  return (
    <div className={styles.activitiesView}>
      <GoBackArrow targetUrl='/' />
      <nav>
        <span>Osoba: &nbsp;</span>
        <select
          onChange={(e) => setSelectedMemberId(Number(e.currentTarget.value))}
        >
          <option value={0}>-</option>
          {members?.items.map((member) => (
            <option value={member.id}>{member.name}</option>
          ))}
        </select>
      </nav>
      <main>
        <ActivitySummary data={activitySummary ?? { items: [] }} />
        <ActivitySummaryBarChart data={activitySummary ?? { items: [] }} />
      </main>
    </div>
  )
}

export default ActivitiesView
