import { Builder, Browser, By, until } from "selenium-webdriver";

/**
 * Open bob in new chrome window, login with google, navigate to attendance page.
 * @param {WebDriver} driver
 * @param {string} email
 * @param {string} password
 */
async function loginAndGoToAttendancePage(driver, email, password) {
  await driver.get("https://app.hibob.com/login/");

  const googleImage = await driver.wait(
    until.elementLocated(By.css('img[alt="Google"]')),
    10000 // Maximum wait time in milliseconds (adjust as needed)
  );

  // Click on the image
  await googleImage.click();

  // Wait for the Google login page to appear
  await driver.wait(
    until.titleIs("Sign in - Google Accounts"),
    10000 // Maximum wait time in milliseconds (adjust as needed)
  );

  // Enter the email address
  await driver.findElement(By.id("identifierId")).sendKeys(email);

  // Click on the Next button
  await driver.findElement(By.id("identifierNext")).click();

  await driver.wait(
    until.elementLocated(By.name("Passwd")),
    10000 // Maximum wait time in milliseconds (adjust as needed)
  );
  // Wait for 1 second
  await driver.sleep(1000);

  // Enter the password
  await driver.findElement(By.name("Passwd")).sendKeys(password);

  // Click on the Next button
  await driver.findElement(By.id("passwordNext")).click();

  // wait until title is 'bob'

  await driver.wait(
    until.titleIs("bob"),
    10000 // Maximum wait time in milliseconds (adjust as needed)
  );

  // Wait for 1 second
  await driver.sleep(1000);

  await driver.get("https://app.hibob.com/attendance/my-attendance/");

  await driver.wait(
    until.titleIs("My attendance - bob"),
    10000 // Maximum wait time in milliseconds (adjust as needed)
  );

  // Wait for 1 second

  await driver.sleep(2000);
}

/**
 * Open bob in new chrome window, login with google, navigate to attendance page, and fill hours.
 * @param {string} email
 * @param {string} password
 */
async function fillHours(email, password) {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await loginAndGoToAttendancePage(driver, email, password);
    let CompleteEntries = [];
    const getEntryDateButtons = async (button) => {
      // get all spans with text-button class
      const elements = await driver.findElements(By.css("span.text-button"));

      const promises = elements.map(
        async (e) => (await e.getText()) === "Complete entry"
      );
      const filtering = await Promise.all(promises);
      const completeEntries = elements.filter((_, index) => filtering[index]);

      // Click on the first Complete entry button
      const promieses2 = completeEntries.map(
        async (e) => await e.findElement(By.xpath(".."))
      );
      CompleteEntries = await Promise.all(promieses2);
    };

    const handleTimeInsertion = async (button) => {
      await button.click();
      await driver.sleep(1000);
      const timePickers = await driver.findElements(By.css("b-timepicker"));

      const firstTimePicker = timePickers[0];
      const secondTimePicker = timePickers[1];

      await firstTimePicker
        .findElement(By.css("input.btmpckr-input-hours"))
        .sendKeys("09");
      await firstTimePicker
        .findElement(By.css("input.btmpckr-input-minutes"))
        .sendKeys("00");

      await secondTimePicker
        .findElement(By.css("input.btmpckr-input-hours"))
        .sendKeys("18");
      await secondTimePicker
        .findElement(By.css("input.btmpckr-input-minutes"))
        .sendKeys("00");

      const select = await driver.findElement(By.css("b-single-select"));

      await select.click();

      const options = await driver.findElement(By.css(".options"));

      const firstOption = await options
        .findElement(By.css(":first-child"))
        .click();

      await driver.findElement(By.id("entries-save-button")).click();
    };

    driver.sleep(2000);
    await getEntryDateButtons();
    while (CompleteEntries.length > 0) {
      driver.sleep(2000);
      await getEntryDateButtons();
      await handleTimeInsertion(CompleteEntries[0]);
      await driver.sleep(2000);
      await getEntryDateButtons();
    }

    driver.sleep(2000);
  } finally {
    await driver.quit();
  }
}

/**
 * Open bob in new chrome window, login with google, navigate to attendance page, find the month that needs finalizing(submitting), and submit it.
 * @param {string} email
 * @param {string} password
 */
async function submitHours(email, password) {
  console.log("submitting hours");
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await loginAndGoToAttendancePage(driver, email, password);
    const dropDown = await driver.findElement(
      By.css("#ATTENDANCE_CHANGE_CYCLE_VIEW_PANEL_ANALYTICS")
    );
    await dropDown.click();
    await driver.sleep(2000);
    const options = driver.findElement(By.css("b-single-list"));
    const finalizeBtn = options.findElement(
      By.xpath("//*[contains(text(), '(Finalize)')]")
    );
    await finalizeBtn.click();
    await driver.sleep(2000);
    const submitBtn = await driver.findElement(
      By.css('button.primary.medium[type="button"]')
    );
    //ensure the inner text of the button is 'Submit'
    if ((await submitBtn.getText()) !== "Submit") {
      console.log(
        "Could not submit hours, please ensure attendance is finalized."
      );
      return;
    }
    await submitBtn.click();
    await driver.sleep(2000);
  } catch (e) {
    console.log(e);
    console.log(
      "Could not submit hours, please ensure attendance is finalized."
    );
  } finally {
    await driver.quit();
  }
}

export { fillHours, submitHours };
