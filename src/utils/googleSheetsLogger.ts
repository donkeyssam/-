// Google Apps Script 웹 앱 연동 유틸리티
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxezq-FkgboCi3Gg_odb8lk_JM7x0hBsGyjccTrhcVgRKGl_VFNK7SOWMSp9dBp9kCm-w/exec';

export interface AnswerLogData {
  studentName: string;
  word: string;
  correctFinal: string;
  selectedFinal: string;
  isCorrect: boolean;
  mode: string;
  attemptCount: number;
  timestamp?: string;
}

export function sendLogToGoogleSheet(logData: AnswerLogData): void {
  const payload = {
    ...logData,
    timestamp: logData.timestamp || new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  };

  try {
    // CORS 및 리다이렉트 처리를 위해 text/plain 방식 활용
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        console.log('[Google Sheet] 기록 완료:', payload);
      })
      .catch((error) => {
        console.error('[Google Sheet] 기록 실패:', error);
      });
  } catch (error) {
    console.error('[Google Sheet] 전송 오류:', error);
  }
}
