import { useEffect, useMemo, useState } from 'react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { ChevronDownIcon, PlusCircleIcon } from '@shopify/polaris-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { PolarisIcon } from '../components/PolarisIcon';
import { PrototypeNoticeDialog } from '../components/PrototypeNoticeDialog';
import { ShopBottomNav } from '../components/ShopBottomNav';
import { SHOP_LOCATION_COUNTRIES } from '../lib/shopLocation';
import { setPaymentsConfirmed } from '../lib/shopStore';
import '@shopify/polaris/build/esm/styles.css';
import './ShopPaymentsPage.css';

type PaymentsNavState = { returnTo?: string };

type PaymentsStep = 1 | 2;

type PersonalForm = {
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

type BankForm = {
  accountHolder: string;
  routingNumber: string;
  accountNumber: string;
  ssn: string;
};

const EMPTY_PERSONAL_FORM: PersonalForm = {
  birthMonth: '',
  birthDay: '',
  birthYear: '',
  country: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};

const EMPTY_BANK_FORM: BankForm = {
  accountHolder: '',
  routingNumber: '',
  accountNumber: '',
  ssn: '',
};

const DUMMY_PERSONAL_FORM: PersonalForm = {
  birthMonth: '03',
  birthDay: '12',
  birthYear: '1992',
  country: 'United States',
  addressLine1: '123 Commerce Street',
  addressLine2: 'Suite 100',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94105',
};

const DUMMY_BANK_FORM: BankForm = {
  accountHolder: 'Alex Morgan',
  routingNumber: '110000000',
  accountNumber: '9876543210',
  ssn: '123456789',
};

function mergeDummyPersonal(form: PersonalForm): PersonalForm {
  return {
    birthMonth: form.birthMonth || DUMMY_PERSONAL_FORM.birthMonth,
    birthDay: form.birthDay || DUMMY_PERSONAL_FORM.birthDay,
    birthYear: form.birthYear || DUMMY_PERSONAL_FORM.birthYear,
    country: form.country || DUMMY_PERSONAL_FORM.country,
    addressLine1: form.addressLine1 || DUMMY_PERSONAL_FORM.addressLine1,
    addressLine2: form.addressLine2 || DUMMY_PERSONAL_FORM.addressLine2,
    city: form.city || DUMMY_PERSONAL_FORM.city,
    state: form.state || DUMMY_PERSONAL_FORM.state,
    postalCode: form.postalCode || DUMMY_PERSONAL_FORM.postalCode,
  };
}

function mergeDummyBank(form: BankForm): BankForm {
  return {
    accountHolder: form.accountHolder || DUMMY_BANK_FORM.accountHolder,
    routingNumber: form.routingNumber || DUMMY_BANK_FORM.routingNumber,
    accountNumber: form.accountNumber || DUMMY_BANK_FORM.accountNumber,
    ssn: form.ssn || DUMMY_BANK_FORM.ssn,
  };
}

export function ShopPaymentsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as PaymentsNavState | null)?.returnTo ?? '/shop/home';
  const [step, setStep] = useState<PaymentsStep>(1);
  const [personalForm, setPersonalForm] = useState<PersonalForm>(EMPTY_PERSONAL_FORM);
  const [bankForm, setBankForm] = useState<BankForm>(EMPTY_BANK_FORM);
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('shopify-prototype-store-type') !== 'shop') {
      navigate('/store-start', { replace: true });
    }
  }, [navigate]);

  const isStep1Valid = useMemo(
    () =>
      personalForm.birthMonth.trim().length > 0 &&
      personalForm.birthDay.trim().length > 0 &&
      personalForm.birthYear.trim().length === 4 &&
      personalForm.country.trim().length > 0 &&
      personalForm.addressLine1.trim().length > 0 &&
      personalForm.city.trim().length > 0 &&
      personalForm.state.trim().length > 0 &&
      personalForm.postalCode.trim().length > 0,
    [personalForm],
  );

  const isStep2Valid = useMemo(
    () =>
      bankForm.accountHolder.trim().length > 0 &&
      bankForm.routingNumber.trim().length === 9 &&
      bankForm.accountNumber.trim().length >= 4 &&
      bankForm.ssn.trim().length === 9,
    [bankForm],
  );

  const isValid = step === 1 ? isStep1Valid : isStep2Valid;

  const updatePersonalForm = (patch: Partial<PersonalForm>) => {
    setPersonalForm((prev) => ({ ...prev, ...patch }));
  };

  const updateBankForm = (patch: Partial<BankForm>) => {
    setBankForm((prev) => ({ ...prev, ...patch }));
  };

  const fillPersonalDummy = () => {
    setPersonalForm((prev) => mergeDummyPersonal(prev));
  };

  const fillBankDummy = () => {
    setBankForm((prev) => mergeDummyBank(prev));
  };

  const goBack = () => navigate(returnTo);

  const handleTopLeft = () => {
    if (step === 2) {
      setStep(1);
      return;
    }
    goBack();
  };

  const handleNext = () => {
    if (step === 1) {
      if (!isStep1Valid) return;
      setStep(2);
      return;
    }

    if (!isStep2Valid) return;
    setPaymentsConfirmed(true);
    navigate(returnTo);
  };

  return (
    <AppProvider i18n={enTranslations}>
      <div className="shop-payments">
        <header className="shop-payments__topbar">
          <button type="button" className="shop-payments__topbar-btn" onClick={handleTopLeft}>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <h1 className="shop-payments__topbar-title">Shopify Payments</h1>
          <button
            type="button"
            className="shop-payments__topbar-btn shop-payments__topbar-btn--next"
            disabled={!isValid}
            onClick={handleNext}
          >
            Next
          </button>
        </header>

        <div className="shop-payments__scroll">
          {step === 1 ? (
            <>
              <section className="shop-payments__main">
                <div className="shop-payments__intro">
                  <h2 className="shop-payments__heading">Setting up Shopify Payments</h2>
                  <p className="shop-payments__subheading">
                    Setup your payments now in order to officially start selling on the Shop app.
                  </p>
                </div>

                <div className="shop-payments__field">
                  <span className="shop-payments__label">Date of Birth</span>
                  <div className="shop-payments__dob-row">
                    <input
                      className="shop-payments__input shop-payments__dob-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM"
                      maxLength={2}
                      value={personalForm.birthMonth}
                      onFocus={fillPersonalDummy}
                      onChange={(event) =>
                        updatePersonalForm({
                          birthMonth: event.target.value.replace(/\D/g, '').slice(0, 2),
                        })
                      }
                    />
                    <input
                      className="shop-payments__input shop-payments__dob-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="DD"
                      maxLength={2}
                      value={personalForm.birthDay}
                      onFocus={fillPersonalDummy}
                      onChange={(event) =>
                        updatePersonalForm({
                          birthDay: event.target.value.replace(/\D/g, '').slice(0, 2),
                        })
                      }
                    />
                    <input
                      className="shop-payments__input shop-payments__dob-input shop-payments__dob-input--year"
                      type="text"
                      inputMode="numeric"
                      placeholder="YYYY"
                      maxLength={4}
                      value={personalForm.birthYear}
                      onFocus={fillPersonalDummy}
                      onChange={(event) =>
                        updatePersonalForm({
                          birthYear: event.target.value.replace(/\D/g, '').slice(0, 4),
                        })
                      }
                    />
                  </div>
                </div>

                <label className="shop-payments__field">
                  <span className="shop-payments__label">Country/Region</span>
                  <span className="shop-payments__select-wrap">
                    <select
                      className="shop-payments__select"
                      value={personalForm.country}
                      onFocus={fillPersonalDummy}
                      onChange={(event) => updatePersonalForm({ country: event.target.value })}
                      required
                    >
                      <option value="">Select a country or region</option>
                      {SHOP_LOCATION_COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <span className="shop-payments__select-chevron" aria-hidden>
                      <PolarisIcon
                        source={ChevronDownIcon}
                        tone="subdued"
                        className="shop-payments__icon--20"
                      />
                    </span>
                  </span>
                </label>

                <label className="shop-payments__field">
                  <span className="shop-payments__label">Address</span>
                  <input
                    className="shop-payments__input"
                    type="text"
                    placeholder="Address #1"
                    value={personalForm.addressLine1}
                    onFocus={fillPersonalDummy}
                    onChange={(event) => updatePersonalForm({ addressLine1: event.target.value })}
                    autoComplete="address-line1"
                  />
                </label>

                <label className="shop-payments__field">
                  <span className="shop-payments__label">Apartment, Suite, etc</span>
                  <input
                    className="shop-payments__input"
                    type="text"
                    placeholder="APT, Suite, Etc"
                    value={personalForm.addressLine2}
                    onFocus={fillPersonalDummy}
                    onChange={(event) => updatePersonalForm({ addressLine2: event.target.value })}
                    autoComplete="address-line2"
                  />
                </label>

                <div className="shop-payments__row">
                  <label className="shop-payments__field">
                    <span className="shop-payments__label">City</span>
                    <input
                      className="shop-payments__input"
                      type="text"
                      placeholder="City"
                      value={personalForm.city}
                      onFocus={fillPersonalDummy}
                      onChange={(event) => updatePersonalForm({ city: event.target.value })}
                      autoComplete="address-level2"
                    />
                  </label>
                  <label className="shop-payments__field">
                    <span className="shop-payments__label">State</span>
                    <input
                      className="shop-payments__input"
                      type="text"
                      placeholder="State"
                      value={personalForm.state}
                      onFocus={fillPersonalDummy}
                      onChange={(event) => updatePersonalForm({ state: event.target.value })}
                      autoComplete="address-level1"
                    />
                  </label>
                </div>

                <label className="shop-payments__field">
                  <span className="shop-payments__label">Zip Code</span>
                  <input
                    className="shop-payments__input"
                    type="text"
                    placeholder="Zipcode"
                    value={personalForm.postalCode}
                    onFocus={fillPersonalDummy}
                    onChange={(event) => updatePersonalForm({ postalCode: event.target.value })}
                    autoComplete="postal-code"
                  />
                </label>
              </section>

              <section className="shop-payments__additional">
                <div className="shop-payments__intro">
                  <h2 className="shop-payments__heading">Additional Payment Methods</h2>
                  <p className="shop-payments__subheading">
                    Don&apos;t want to set up Shopify Payments? Add additional payment methods
                  </p>
                </div>

                <button
                  type="button"
                  className="shop-payments__add-method"
                  onClick={() => setNoticeOpen(true)}
                >
                  <PolarisIcon source={PlusCircleIcon} className="shop-payments__icon--20" />
                  <span className="shop-payments__add-method-title">
                    Add an additional payment method
                  </span>
                </button>
              </section>
            </>
          ) : (
            <section className="shop-payments__main">
              <div className="shop-payments__intro">
                <h2 className="shop-payments__heading">Bank account details</h2>
                <p className="shop-payments__subheading">
                  Add the bank account where you want Shopify Payments deposits sent.
                </p>
              </div>

              <label className="shop-payments__field">
                <span className="shop-payments__label">Account holder name</span>
                <input
                  className="shop-payments__input"
                  type="text"
                  placeholder="Name on bank account"
                  value={bankForm.accountHolder}
                  onFocus={fillBankDummy}
                  onChange={(event) => updateBankForm({ accountHolder: event.target.value })}
                  autoComplete="name"
                />
              </label>

              <label className="shop-payments__field">
                <span className="shop-payments__label">Routing number</span>
                <input
                  className="shop-payments__input"
                  type="text"
                  inputMode="numeric"
                  placeholder="9 digits"
                  maxLength={9}
                  value={bankForm.routingNumber}
                  onFocus={fillBankDummy}
                  onChange={(event) =>
                    updateBankForm({
                      routingNumber: event.target.value.replace(/\D/g, '').slice(0, 9),
                    })
                  }
                />
              </label>

              <label className="shop-payments__field">
                <span className="shop-payments__label">Account number</span>
                <input
                  className="shop-payments__input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Account number"
                  value={bankForm.accountNumber}
                  onFocus={fillBankDummy}
                  onChange={(event) =>
                    updateBankForm({
                      accountNumber: event.target.value.replace(/\D/g, ''),
                    })
                  }
                  autoComplete="off"
                />
              </label>

              <label className="shop-payments__field">
                <span className="shop-payments__label">Social Security Number</span>
                <input
                  className="shop-payments__input"
                  type="password"
                  inputMode="numeric"
                  placeholder="9 digits"
                  maxLength={9}
                  value={bankForm.ssn}
                  onFocus={fillBankDummy}
                  onChange={(event) =>
                    updateBankForm({
                      ssn: event.target.value.replace(/\D/g, '').slice(0, 9),
                    })
                  }
                  autoComplete="off"
                />
              </label>
            </section>
          )}
        </div>

        <ShopBottomNav activeTab="home" />

        <PrototypeNoticeDialog open={noticeOpen} onClose={() => setNoticeOpen(false)} />
      </div>
    </AppProvider>
  );
}
