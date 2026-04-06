import os
import csv
import json
import gspread
import pandas as pd
import sys
import time

CREDENTIALS_FILE = 'credentials.json'
SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1dYj9RUoNNPSyGjJ_A9yP5AFsM4i1SQB3y9M0drY45tg/edit?usp=sharing'
AUDIT_FOLDER = 'UX Audit'

def main():
    print("Connecting to Google Sheets...")
    try:
        if 'GOOGLE_CREDENTIALS_JSON' in os.environ:
            # Running on Render using an environment variable
            credentials_dict = json.loads(os.environ['GOOGLE_CREDENTIALS_JSON'])
            gc = gspread.service_account_from_dict(credentials_dict)
        else:
            # Fallback for local development
            gc = gspread.service_account(filename=CREDENTIALS_FILE)
            
        sh = gc.open_by_url(SPREADSHEET_URL)
    except Exception as e:
        print(f"Failed to connect to Google Sheets: {e}")
        return

    if not os.path.exists(AUDIT_FOLDER):
        print(f"Folder '{AUDIT_FOLDER}' does not exist.")
        return

    valid_titles = []
    
    target_file = None
    if len(sys.argv) > 1:
        target_file = sys.argv[1]
        
    for filename in os.listdir(AUDIT_FOLDER):
        if filename.endswith(".csv"):
            if target_file and filename != target_file:
                # Still track valid titles so we don't accidentally delete other sheets
                sheet_title = filename.split('_')[0][:50]
                valid_titles.append(sheet_title)
                continue
                
            filepath = os.path.join(AUDIT_FOLDER, filename)
            # Use only the brand name (first part before the underscore) for the Google Sheet tab title
            sheet_title = filename.split('_')[0][:50]
            valid_titles.append(sheet_title)
            print(f"Uploading {filepath} to sheet '{sheet_title}'...")
            
            # Read CSV
            df = pd.read_csv(filepath)
            df = df.fillna("")
            df.rename(columns={'Index': '#'}, inplace=True)
            
            # Formulate data list [headers, ...rows]
            data = [df.columns.values.tolist()] + df.values.tolist()
            
            # Always delete the old sheet if it exists, to ensure no duplicates and a fresh update
            try:
                existing_worksheet = sh.worksheet(sheet_title)
                print(f"  Deleting existing duplicate sheet '{sheet_title}'...")
                sh.del_worksheet(existing_worksheet)
            except gspread.exceptions.WorksheetNotFound:
                pass
                
            print(f"  Creating new latest sheet '{sheet_title}'...")
            worksheet = sh.add_worksheet(title=sheet_title, rows=str(max(100, len(data)+10)), cols=str(max(20, len(df.columns)+5)))
            
            # Update the worksheet
            worksheet.update(values=data, range_name=f'A1:{chr(ord("A") + len(df.columns) - 1)}{len(data)}', value_input_option='USER_ENTERED')
            
            # Formatting
            from gspread_formatting import (
                cellFormat, color, textFormat, borders, border, format_cell_range,
                set_column_width, set_row_height, DataValidationRule, BooleanCondition, set_data_validation_for_cell_range,
                ConditionalFormatRule, BooleanRule, GridRange, get_conditional_format_rules, padding
            )

            num_rows = len(data)
            num_cols = len(df.columns)
            end_col_letter = chr(ord('A') + num_cols - 1)
            full_range = f'A1:{end_col_letter}{num_rows}'
            header_range = f'A1:{end_col_letter}1'

            # 1px solid black border for all rows and columns
            border_style = border('SOLID', color(0, 0, 0))
            all_borders = borders(top=border_style, bottom=border_style, left=border_style, right=border_style)

            fmt_header = cellFormat(
                backgroundColor=color(0.25, 0.35, 0.55), # Beautiful soft blue
                textFormat=textFormat(bold=True, foregroundColor=color(1, 1, 1), fontSize=11),
                horizontalAlignment='CENTER',
                verticalAlignment='MIDDLE',
                borders=all_borders
            )

            cell_padding = padding(top=8, bottom=8, left=8, right=8)

            fmt_body = cellFormat(
                verticalAlignment='MIDDLE',
                wrapStrategy='WRAP',
                borders=all_borders,
                padding=cell_padding
            )
            
            fmt_body_center = cellFormat(
                horizontalAlignment='CENTER',
                verticalAlignment='MIDDLE',
                wrapStrategy='WRAP',
                borders=all_borders,
                padding=cell_padding
            )

            format_cell_range(worksheet, header_range, fmt_header)
            format_cell_range(worksheet, f'F2:{end_col_letter}{num_rows}', fmt_body)
            format_cell_range(worksheet, f'B2:E{num_rows}', fmt_body)
            format_cell_range(worksheet, f'A2:A{num_rows}', fmt_body_center)
            format_cell_range(worksheet, f'I2:K{num_rows}', fmt_body_center)
            
            # Make proper spacing (column widths and row heights)
            set_column_width(worksheet, 'A', 60)   # Index
            set_column_width(worksheet, 'B', 180)  # Heuristic
            set_column_width(worksheet, 'C', 120)  # Screenshot
            set_column_width(worksheet, 'D', 200)  # Page URL
            set_column_width(worksheet, 'E', 120)  # Page Name
            set_column_width(worksheet, 'F', 350)  # Issue Description
            set_column_width(worksheet, 'G', 250)  # Behavioral Insight
            set_column_width(worksheet, 'H', 250)  # Attitudinal Insight
            set_column_width(worksheet, 'I', 140)  # Cognitive Load
            set_column_width(worksheet, 'J', 100)  # Severity
            set_column_width(worksheet, 'K', 100)  # Priority
            set_column_width(worksheet, 'L', 350)  # Recommendation
            
            # Set minimum height for data rows for better spacing
            set_row_height(worksheet, f'2:{num_rows}', 120)
            # Set explicit height for the sticky title row
            set_row_height(worksheet, '1', 50)
            
            # Add Dropdowns
            rule_cog_load = DataValidationRule(BooleanCondition('ONE_OF_LIST', ['Low', 'Medium', 'High']), showCustomUi=True)
            rule_severity = DataValidationRule(BooleanCondition('ONE_OF_LIST', ['1', '2', '3', '4', '5']), showCustomUi=True)
            rule_priority = DataValidationRule(BooleanCondition('ONE_OF_LIST', ['P0', 'P1', 'P2', 'P3', 'P4']), showCustomUi=True)

            set_data_validation_for_cell_range(worksheet, f'I2:I{num_rows}', rule_cog_load)
            set_data_validation_for_cell_range(worksheet, f'J2:J{num_rows}', rule_severity)
            set_data_validation_for_cell_range(worksheet, f'K2:K{num_rows}', rule_priority)
            
            time.sleep(2) # Prevent quota issues
            
            # Add Conditional Formatting Colors
            rules = get_conditional_format_rules(worksheet)
            
            bg_red = color(1, 0.8, 0.8)
            bg_yellow = color(1, 0.95, 0.8)
            bg_green = color(0.85, 1, 0.85)

            # Cognitive Load
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'I2:I{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['High']), format=cellFormat(backgroundColor=bg_red))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'I2:I{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['Medium']), format=cellFormat(backgroundColor=bg_yellow))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'I2:I{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['Low']), format=cellFormat(backgroundColor=bg_green))))

            # Severity (4/5 = Red, 3 = Yellow, 1/2 = Green)
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'J2:J{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['5']), format=cellFormat(backgroundColor=bg_red))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'J2:J{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['4']), format=cellFormat(backgroundColor=bg_red))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'J2:J{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['3']), format=cellFormat(backgroundColor=bg_yellow))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'J2:J{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['2']), format=cellFormat(backgroundColor=bg_green))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'J2:J{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['1']), format=cellFormat(backgroundColor=bg_green))))

            # Priority (P0/P1 = Red, P2 = Yellow, P3/P4 = Green)
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'K2:K{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['P0']), format=cellFormat(backgroundColor=bg_red))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'K2:K{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['P1']), format=cellFormat(backgroundColor=bg_red))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'K2:K{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['P2']), format=cellFormat(backgroundColor=bg_yellow))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'K2:K{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['P3']), format=cellFormat(backgroundColor=bg_green))))
            rules.append(ConditionalFormatRule(ranges=[GridRange.from_a1_range(f'K2:K{num_rows}', worksheet)], booleanRule=BooleanRule(condition=BooleanCondition('TEXT_EQ', ['P4']), format=cellFormat(backgroundColor=bg_green))))
            
            rules.save()
            
            # Freeze top row
            worksheet.freeze(rows=1)
            
            print(f"  Done updating and formatting '{sheet_title}'.")

    # Cleanup duplicate/old sheets from previous names to ensure only the latest sheet stays
    for ws in sh.worksheets():
        if ("Usability" in ws.title or "UX_Audit" in ws.title) and ws.title not in valid_titles:
            print(f"Deleting older duplicate sheet: {ws.title}")
            try:
                sh.del_worksheet(ws)
            except Exception as e:
                print(f"Error deleting sheet {ws.title}: {e}")

if __name__ == "__main__":
    main()
