import * as Excel from 'exceljs'
import * as FileSaver from 'file-saver'

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

const exportExcelTypeSupply = async (input: any) => {
  try {
    const fileExtension = '.xlsx'
    const wb = new Excel.Workbook()
    const ws = wb.addWorksheet('Danh sách loại vật tư')
    const { data = [] } = input

    ws.pageSetup.printTitlesColumn = 'A:K'
    ws.pageSetup.paperSize = 9
    ws.views = [{ showGridLines: false }]

    ws.getColumn('A').width = 5
    ws.getColumn('B').width = 15
    ws.getColumn('C').width = 25
    ws.getColumn('D').width = 30
    ws.getColumn('E').width = 15
    ws.getColumn('F').width = 25
    ws.getColumn('G').width = 25
    ws.getColumn('H').width = 25
    ws.getColumn('I').width = 25
    ws.getColumn('J').width = 5 //

    ws.mergeCells('B2:I2')
    ws.getCell('B2').font = { size: 15, bold: true, name: 'Times New Roman' }
    ws.getCell('B2').value = 'Danh mục loại vật tư'
    const startTable = 4

    ws.getRow(4).alignment = { vertical: 'middle', wrapText: true }
    ws.getRow(4).font = { size: 14, name: 'Times New Roman', bold: true }
    ws.getCell(`B${4}`).value = 'STT'
    ws.getCell(`B${4}`).alignment = { horizontal: 'center' }
    ws.getCell(`B${4}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }

    ws.getCell(`C${4}`).value = 'Mã loại vật tư'
    ws.getCell(`C${4}`).alignment = { horizontal: 'center' }
    ws.getCell(`C${4}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }

    ws.getCell(`D${4}`).value = 'Tên loại vật tư'
    ws.getCell(`D${4}`).alignment = { horizontal: 'center' }
    ws.getCell(`D${4}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
    ws.getCell(`E${4}`).value = 'Mô tả'
    ws.getCell(`E${4}`).alignment = { horizontal: 'center' }
    ws.getCell(`E${4}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
    ws.getCell(`F${4}`).value = 'Trạng thái'
    ws.getCell(`F${4}`).alignment = { horizontal: 'center' }
    ws.getCell(`F${4}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
    const bodyTable = startTable + 1
    // const endTable = bodyTable + data.length
    let stt = 0

    for (let i = 0; i < data.length; i++) {
      ws.getRow(bodyTable + i).alignment = { vertical: 'middle', wrapText: true }
      ws.getRow(bodyTable + i).font = { size: 14, name: 'Times New Roman', bold: i === startTable }
      const item = data[i]

      stt += 1

      ws.getCell(`B${bodyTable + i}`).value = stt
      ws.getCell(`B${bodyTable + i}`).alignment = { horizontal: 'center' }
      ws.getCell(`B${bodyTable + i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
      ws.getCell(`C${bodyTable + i}`).value = item.code
      ws.getCell(`C${bodyTable + i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
      ws.getCell(`D${bodyTable + i}`).value = item.name
      ws.getCell(`D${bodyTable + i}`).alignment = { horizontal: 'center' }
      ws.getCell(`D${bodyTable + i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }

      ws.getCell(`E${bodyTable + i}`).value = item.description
      ws.getCell(`E${bodyTable + i}`).alignment = { horizontal: 'center' }
      ws.getCell(`E${bodyTable + i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }

      ws.getCell(`F${bodyTable + i}`).value = item?.lock ? 'Khoá' : 'Mở'
      ws.getCell(`F${bodyTable + i}`).alignment = { horizontal: 'center' }
      ws.getCell(`F${bodyTable + i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }

    await wb.xlsx.writeBuffer().then(async buffer => {
      const data = new Blob([buffer], { type: fileType })

      FileSaver.saveAs(data, 'Danh sách loại vật tư' + fileExtension)
    })

    return 'success'
  } catch (error) {
    console.log(error)
  }
}

export default exportExcelTypeSupply
