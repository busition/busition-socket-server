module.exports = {
  apps: [
    {
      script: "./src/server.js",
      instances: "1", // 실행시킬 프로세스의 개수
      exec_mode: "cluster", // cluster 모드로 어플리케이션을 구동
      max_memory_restart: "300M", // 프로세스의 메모리가 300MB에 도달하면 reload
    },
  ],
};
