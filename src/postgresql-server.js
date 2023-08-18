import pg from "pg"; // pg 모듈을 불러옵니다.

// 커넥션을 정의합니다.
// RDS Console 에서 본인이 설정한 값을 입력해주세요.
async function getPostgresqlClient() {
  const connectionConfig = {
    user: "ironman",
    password: "11111111",
    database: "test",
    host: "nodejs-rds.cir7ovuqdtc1.us-east-2.rds.amazonaws.com",
    port: 5432, // PostgreSQL 기본 포트 번호
  };
  const client = new pg.Client(connectionConfig);
  await client.connect();
  return client;
}

// 클라이언트를 생성하고 RDS에 접속합니다.

(async () => {
  try {
    // 접속 시도

    // 쿼리 실행 및 결과 처리
    const queryResult = await client.query("SELECT * FROM fruit");
    console.log(queryResult.rows); // 결과를 출력합니다!
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end(); // 연결 종료
  }
})();
