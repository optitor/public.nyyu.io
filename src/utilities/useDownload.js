import { useState } from 'react';
import { downloadContent } from './utility-methods';

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const startDownload = async (id, tx, payment) => {
    setIsDownloading(true);
    await downloadContent(id, tx, payment);
    setIsDownloading(false);
  };

  return [startDownload, isDownloading];
};
