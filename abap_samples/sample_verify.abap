*&---------------------------------------------------------------------*
*& Report  ZVERIFY_SAMPLE
*& Sample ABAP program to demonstrate VERIFY and regex checks
*&---------------------------------------------------------------------*
REPORT zverify_sample.

DATA: lv_digits TYPE string VALUE '12345',
      lv_mixed  TYPE string VALUE 'abc123',
      lv_alpha  TYPE string VALUE 'abc',
      lv_email  TYPE string VALUE 'user@example.com'.

" 1) Use VERIFY to check character set membership
VERIFY lv_alpha IN CHARACTER SET 'abcdefghijklmnopqrstuvwxyz'.
IF sy-subrc = 0.
  WRITE: / 'VERIFY: "', lv_alpha, '" contains only lowercase letters'.
ELSE.
  WRITE: / 'VERIFY: "', lv_alpha, '" contains other characters'.
ENDIF.

VERIFY lv_mixed IN CHARACTER SET 'abcdefghijklmnopqrstuvwxyz'.
IF sy-subrc = 0.
  WRITE: / 'VERIFY: "', lv_mixed, '" contains only lowercase letters'.
ELSE.
  WRITE: / 'VERIFY: "', lv_mixed, '" contains other characters'.
ENDIF.

" 2) Use FIND REGEX to validate digits-only string
FIND REGEX '^[0-9]+$' IN lv_digits.
IF sy-subrc = 0.
  WRITE: / 'FIND REGEX: "', lv_digits, '" is digits only'.
ELSE.
  WRITE: / 'FIND REGEX: "', lv_digits, '" is NOT digits only'.
ENDIF.

FIND REGEX '^[0-9]+$' IN lv_mixed.
IF sy-subrc = 0.
  WRITE: / 'FIND REGEX: "', lv_mixed, '" is digits only'.
ELSE.
  WRITE: / 'FIND REGEX: "', lv_mixed, '" is NOT digits only'.
ENDIF.

" 3) Simple email pattern check (basic)
FIND REGEX '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' IN lv_email.
IF sy-subrc = 0.
  WRITE: / 'FIND REGEX: "', lv_email, '" looks like an email'.
ELSE.
  WRITE: / 'FIND REGEX: "', lv_email, '" does NOT look like an email'.
ENDIF.
