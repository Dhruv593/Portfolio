export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...args);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`);
    if (error) {
      if (error instanceof Error) {
        console.error(`Name: ${error.name} | Message: ${error.message}`);
        console.error(`Stack: ${error.stack}`);
      } else {
        console.error('Details:', error);
      }
    }
  },
  mongoStatus: (status: 'CONNECTED' | 'FAILED' | 'DISCONNECTED', uri?: string, errorMsg?: string) => {
    const sanitizedUri = uri ? uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') : 'N/A';
    console.log('\n====================================================');
    console.log(`MongoDB Connection Status: ${status}`);
    if (uri) console.log(`Target URI: ${sanitizedUri}`);
    console.log(`Database Name: portfolio_admin`);
    if (errorMsg) console.log(`Issue Details: ${errorMsg}`);
    console.log('====================================================\n');
  }
};
