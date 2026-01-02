ABAP Samples - VERIFY and Regex

Files:
- `abap_samples/sample_verify.abap`: Small ABAP report demonstrating `VERIFY` (character-set checks) and `FIND REGEX` (pattern checks).

How to run:
- Open the ABAP Editor (SE38/SA38) in your SAP system.
- Create a new report (e.g., `ZVERIFY_SAMPLE`) and paste the contents of `sample_verify.abap`.
- Activate and execute the report to see verification outputs in the list output.

Notes:
- `VERIFY` returns `sy-subrc = 0` when all characters are in the provided character set.
- `FIND REGEX` sets `sy-subrc = 0` when the regex matches.
- The email regex is a simple check, not fully RFC-compliant.
