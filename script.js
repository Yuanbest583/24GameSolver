document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.number-input');
    const calculateBtn = document.getElementById('calc-btn');
    const resultContent = document.getElementById('result-content');
    const resultWrapper = document.getElementById('result-wrapper');
    const errorMessage = document.getElementById('error-message');
    const statsElement = document.getElementById('stats');

    const copySvg = `<svg class="copy-icon" viewBox="0 0 24 24"><path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/></svg>`;
    const checkSvg = `<svg class="copy-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`;

    calculateBtn.addEventListener('click', calculate24);

    function copyToClipboard(text, btn) {
        const fallbackCopy = (str) => {
            const el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute'; el.style.left = '-9999px';
            document.body.appendChild(el); el.select();
            const success = document.execCommand('copy');
            document.body.removeChild(el);
            return success;
        };
        const doFeedback = () => {
            btn.classList.add('copied'); btn.innerHTML = checkSvg;
            setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = copySvg; }, 1500);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(doFeedback).catch(() => fallbackCopy(text) && doFeedback());
        } else { if (fallbackCopy(text)) doFeedback(); }
    }

    function calculate24() {
        errorMessage.textContent = '';
        resultContent.innerHTML = '';
        statsElement.textContent = '';
        resultWrapper.style.display = 'none';

        const nums = []; let isValid = true;
        inputs.forEach(input => {
            const val = parseInt(input.value);
            if (isNaN(val) || val < 1 || val > 13) { isValid = false; input.style.borderColor = '#ff4d4f'; }
            else { nums.push(val); input.style.borderColor = '#eee'; }
        });

        if (!isValid) {
            errorMessage.textContent = 'Invalid numbers (1-13)';
            return;
        }

        const startTime = performance.now();
        const solutionsSet = new Set(); const solutionsList = [];

        function solve(arr) {
            if (arr.length === 1) {
                if (Math.abs(arr[0].val - 24) < 0.000001) {
                    const canonical = getCanonical(arr[0].node);
                    if (!solutionsSet.has(canonical.id)) {
                        solutionsSet.add(canonical.id); solutionsList.push(canonical.display);
                    }
                }
                return;
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                    if (i === j) continue;
                    const remaining = arr.filter((_, idx) => idx !== i && idx !== j);
                    const a = arr[i]; const b = arr[j];
                    const ops = [{ o: '+', v: a.val + b.val }, { o: '-', v: a.val - b.val }, { o: '*', v: a.val * b.val }];
                    if (Math.abs(b.val) > 0.000001) ops.push({ o: '/', v: a.val / b.val });
                    ops.forEach(o => {
                        const newNode = { type: 'op', op: o.o, left: a.node, right: b.node };
                        solve([...remaining, { val: o.v, node: newNode }]);
                    });
                }
            }
        }
        solve(nums.map(n => ({ val: n, node: { type: 'num', val: n } })));
        const endTime = performance.now();

        resultWrapper.style.display = 'block';

        if (solutionsList.length === 0) {
            resultContent.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#999; padding:10px;">No solutions found</div>';
        } else {
            solutionsList.sort().forEach(expr => {
                const fullText = expr + " = 24";
                const card = document.createElement('div'); card.className = 'solution'; card.textContent = fullText;
                const copyBtn = document.createElement('button'); copyBtn.className = 'copy-btn'; copyBtn.innerHTML = copySvg;
                copyBtn.onclick = (e) => { e.preventDefault(); copyToClipboard(fullText, copyBtn); };
                card.appendChild(copyBtn); resultContent.appendChild(card);
            });
        }
        statsElement.textContent = `${solutionsList.length} solutions found in ${(endTime - startTime).toFixed(1)}ms`;
    }

    function getCanonical(node, parentPrec = 0) {
        if (node.type === 'num') return { id: node.val.toString(), display: node.val.toString(), prec: 99 };
        const precMap = { '+': 1, '-': 1, '*': 2, '/': 2 };
        const currentPrec = precMap[node.op];
        const isAddGroup = (node.op === '+' || node.op === '-');
        let terms = [];
        collect(node, isAddGroup ? '+' : '*', terms, false);
        const posTerms = terms.filter(t => !t.isInv).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
        const negTerms = terms.filter(t => t.isInv).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
        const id = (isAddGroup ? 'A' : 'M') + '(P:' + posTerms.map(t => t.id).join(',') + ';N:' + negTerms.map(t => t.id).join(',') + ')';
        let display = "";
        if (posTerms.length > 0) {
            display = posTerms[0].display;
            for (let i = 1; i < posTerms.length; i++) { display += ` ${isAddGroup ? '+' : '*'} ${posTerms[i].display}`; }
            for (let i = 0; i < negTerms.length; i++) { display += ` ${isAddGroup ? '-' : '/'} ${negTerms[i].display}`; }
        } else {
            display = (isAddGroup ? '-' : '1/') + negTerms[0].display;
            for (let i = 1; i < negTerms.length; i++) { display += ` ${isAddGroup ? '-' : '/'} ${negTerms[i].display}`; }
        }
        if (currentPrec < parentPrec) { display = `(${display})`; }
        return { id, display, prec: currentPrec };
    }

    function collect(node, targetOp, terms, isInv) {
        if (node.type === 'num') {
            terms.push({ id: node.val.toString(), display: node.val.toString(), isInv, prec: 99 });
            return;
        }
        const canMerge = (targetOp === '+' && (node.op === '+' || node.op === '-')) || (targetOp === '*' && (node.op === '*' || node.op === '/'));
        if (canMerge) {
            collect(node.left, targetOp, terms, isInv);
            const nextInv = (node.op === '-' || node.op === '/') ? !isInv : isInv;
            collect(node.right, targetOp, terms, nextInv);
        } else {
            const sub = getCanonical(node, targetOp === '+' ? 1 : 2);
            terms.push({ id: sub.id, display: sub.display, isInv, prec: sub.prec });
        }
    }
});