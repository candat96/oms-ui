'use client'

import { useCallback, useState } from 'react'

import { useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid'

import DrawerCore from '@/components/drawer/core'
import { FormEach } from '@/components/form/function-form'
import type { IFieldType } from '@/components/form/render-input'
import renderFields from '@/components/form/render-input'
import TableCore from '@/components/table/core'
import { useDictionary } from '@/hooks/DictionaryContext'
import {
  useCreateUnitMutation,
  useListUnitQuery,
  useRemoveUnitMutation,
  useUpdateUnitMutation
} from '@/redux-store/slices/cate-unit'
import type { IUnit } from '@/types/category/unit'
import { useTableUnit } from './component/useTable'

// export default function PageUnit({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
export default function PageUnit() {
  const dictionary = useDictionary()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const Unit = useListUnitQuery({})
  const [createUnit, { isLoading: createLoading }] = useCreateUnitMutation()
  const [updateUnit, { isLoading: updateLoading }] = useUpdateUnitMutation()
  const [removeUnit] = useRemoveUnitMutation()

  const methods = useForm<IUnit>({
    defaultValues: {
      code: '',
      name: '0',
      id: ''
    }
  })

  const { setValue } = methods

  const handleCreate = () => {
    setIsEdit(false)
    setDrawerOpen(true)
  }

  const handleOnEdit = useCallback(
    (data: IUnit) => {
      setIsEdit(true)
      FormEach<IUnit>({ ...data }, setValue)
      setDrawerOpen(true)
    },
    [setValue]
  )

  const handleOnRemove = useCallback(
    (data: IUnit) => {
      removeUnit(data.id)
    },
    [removeUnit]
  )

  const { columns } = useTableUnit({ handleEdit: handleOnEdit, handleDelete: handleOnRemove })

  const handleOnFinish = (value: { [s: string]: unknown } & IUnit) => {
    const result = {
      code: value.code,
      name: value.name
    }

    if (isEdit) {
      updateUnit({ ...result, id: value.id }).finally(() => {
        setDrawerOpen(false)
        setIsEdit(false)
      })
    } else {
      createUnit(result).finally(() => {
        setDrawerOpen(false)
      })
    }
  }

  const inputs: IFieldType[] = [
    {
      type: 'input',
      name: 'code',
      colProps: { xs: 6 },
      inputProps: {
        label: dictionary['unit'].name,
        autoFocus: true
      },
      controlProps: { rules: { required: true } }
    },
    {
      type: 'input',
      name: 'name',
      colProps: { xs: 6 },
      inputProps: { label: dictionary['unit'].code },
      controlProps: { rules: { required: true } }
    }
  ]

  return (
    <section>
      <TableCore<IUnit>
        header={{ filter: false, select: true, create: { fn: handleCreate } }}
        columns={columns}
        data={(Unit.data?.docs || []) as IUnit[]}
      />

      <DrawerCore
        drawerOpen={drawerOpen}
        methods={methods}
        onValid={handleOnFinish}
        setDrawerOpen={setDrawerOpen}
        size={{ base: '100%', md: 700 }}
        title={isEdit ? dictionary['unit'].updateUnit : dictionary['unit'].createUnit}
        loading={createLoading || updateLoading}
        // dictionary={dictionary}
      >
        <Grid container spacing={4}>
          {inputs.map(input => renderFields({ ...input, errors: methods.formState.errors }))}
        </Grid>
      </DrawerCore>
    </section>
  )
}
