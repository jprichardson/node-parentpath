function (err, result) {
                if (err instanceof Error) {
                    self.errorCallback(err);
                    return;
                } 
                else { //not an error
                    result = err;
                }

                self.results.push(result);
                self.pending -= 1;

                if (self.pending === 0) {
                    endCallback(self.results);
                }
            }